// Localização: MasterErp.Services/Services/Forms/FormTemplateService.cs
using AutoMapper;
using MasterErp.Domain.Models.Forms;
using MasterErp.Infraestructure.Context;
using MasterErp.Services.DTOs.Forms;
using MasterErp.Services.Interfaces.Forms;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.Services.Services.Forms
{
    public class FormTemplateService : IFormTemplateService
    {
        private readonly SqlContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<FormTemplateService> _logger;

        public FormTemplateService(SqlContext context, IMapper mapper, ILogger<FormTemplateService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<FormTemplateBasicDto>> GetActiveTemplatesAsync()
        {
            _logger.LogInformation("Buscando templates de formulário ativos (versão mais recente de cada).");
            // Esta query busca o template com a maior versão para cada nome de template que está ativo.
            // Pode ser otimizada dependendo do volume de dados.
            var latestActiveTemplates = await _context.FormTemplates
                .Where(t => t.IsActive)
                .GroupBy(t => t.Name) // Agrupa por nome para pegar a última versão de cada
                .Select(g => g.OrderByDescending(t => t.Version).First())
                .OrderBy(t => t.Name)
                .ToListAsync();

            return _mapper.Map<IEnumerable<FormTemplateBasicDto>>(latestActiveTemplates);
        }

        public async Task<FormTemplateDetailDto?> GetTemplateDetailAsync(int templateId, int? version = null)
        {
            _logger.LogInformation("Buscando detalhes do template ID: {TemplateId}, Versão: {Version}", templateId, version.HasValue ? version.Value.ToString() : "latest active");
            var query = _context.FormTemplates
                                    .AsNoTracking()
                                    .Include(t => t.HeaderFields.OrderBy(hf => hf.Order))
                                    .Include(t => t.Sections.OrderBy(s => s.Order))
                                        .ThenInclude(s => s.Items.OrderBy(i => i.Order))
                                    .Where(t => t.Id == templateId); // Primeiro filtra pelo ID original do template

            if (version.HasValue)
            {
                query = query.Where(t => t.Version == version.Value);
            }
            else
            {
                // Pega a versão mais recente ATIVA se nenhuma versão específica for solicitada
                query = query.Where(t => t.IsActive).OrderByDescending(t => t.Version);
            }

            var template = await query.FirstOrDefaultAsync();

            if (template == null)
            {
                _logger.LogWarning("Template não encontrado. ID Original: {TemplateId}, Versão: {Version}", templateId, version.HasValue ? version.Value.ToString() : "latest active");
                return null;
            }

            return _mapper.Map<FormTemplateDetailDto>(template);
        }

        public async Task<FormTemplateDetailDto> CreateTemplateAsync(FormTemplateCreateDto dto, int createdByUserId)
        {
            _logger.LogInformation("Tentativa de criar novo template '{TemplateName}' pelo usuário ID: {UserId}", dto.Name, createdByUserId);

            if (await _context.FormTemplates.AnyAsync(t => t.Name == dto.Name && t.IsActive))
            {
                _logger.LogWarning("Tentativa de criar template com nome '{TemplateName}' que já existe e está ativo.", dto.Name);
                throw new ArgumentException($"Um modelo de formulário ativo com o nome '{dto.Name}' já existe.");
            }

            var template = _mapper.Map<FormTemplate>(dto); // Mapeia o DTO para a entidade
            template.CreatedByUserId = createdByUserId;
            template.CreatedAt = DateTime.UtcNow;
            template.Version = 1; // Primeira versão
            template.IsActive = true;

            _context.FormTemplates.Add(template);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Template '{TemplateName}' (ID: {TemplateIdDB}, Versão: 1) criado com sucesso.", template.Name, template.Id);

            // Para retornar o DetailDto, precisamos carregar as inclusões (se não foram mapeadas do DTO)
            // ou re-buscar do banco. O AutoMapper pode ser configurado para mapear as coleções aninhadas do DTO.
            // Assumindo que o mapeamento de FormTemplateCreateDto para FormTemplate já lida com HeaderFields e Sections:
            return _mapper.Map<FormTemplateDetailDto>(template);
        }

        public async Task<FormTemplateDetailDto?> UpdateTemplateAsync(int templateId, FormTemplateUpdateDto dto, int updatedByUserId)
        {
            _logger.LogInformation("Tentativa de atualizar template ID original: {TemplateId} para o nome '{TemplateName}' pelo usuário ID: {UserId}", templateId, dto.Name, updatedByUserId);

            // Encontra a versão mais recente ATIVA do template com o ID original fornecido.
            // O templateId aqui refere-se ao ID da "primeira versão" ou "ID raiz" do template.
            var latestActiveVersion = await _context.FormTemplates
                                        .Where(t => t.Id == templateId && t.IsActive) // Ou use um campo `RootTemplateId` se preferir
                                        .OrderByDescending(t => t.Version)
                                        .FirstOrDefaultAsync();

            if (latestActiveVersion == null)
            {
                _logger.LogWarning("Nenhuma versão ativa encontrada para o template ID original: {TemplateId} para atualização.", templateId);
                return null; // Ou throw new KeyNotFoundException(...);
            }

            // Estratégia: Criar uma nova versão.
            // 1. Desativar a versão antiga (opcional, dependendo da sua estratégia de arquivamento)
            // latestActiveVersion.IsActive = false;
            // latestActiveVersion.UpdatedAt = DateTime.UtcNow;
            // _context.FormTemplates.Update(latestActiveVersion);

            // 2. Criar a nova versão
            var newVersionTemplate = _mapper.Map<FormTemplate>(dto); // Mapeia o DTO de atualização para uma nova entidade
            newVersionTemplate.Id = 0; // Força a criação de um novo registro com novo ID PK
            newVersionTemplate.Name = latestActiveVersion.Name; // Mantém o nome original do grupo de versões
            // Ou, se o nome puder mudar entre versões do mesmo "template lógico":
            // newVersionTemplate.Name = dto.Name;
            // Adicionar um RootTemplateId para agrupar versões seria uma boa prática aqui.
            newVersionTemplate.Version = latestActiveVersion.Version + 1;
            newVersionTemplate.CreatedAt = DateTime.UtcNow; // Data de criação desta versão
            newVersionTemplate.CreatedByUserId = updatedByUserId; // Quem criou esta versão
            newVersionTemplate.IsActive = true; // A nova versão é a ativa

            _context.FormTemplates.Add(newVersionTemplate);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Nova versão ({NewVersion}) do template '{TemplateName}' (Novo ID PK: {NewId}) criada com sucesso.", newVersionTemplate.Version, newVersionTemplate.Name, newVersionTemplate.Id);

            return _mapper.Map<FormTemplateDetailDto>(newVersionTemplate);
        }


        public async Task<bool> DeleteTemplateAsync(int templateId)
        {
            // O templateId aqui refere-se ao ID da "primeira versão" ou "ID raiz" do template.
            // Estratégia: Desativar TODAS as versões deste template.
            _logger.LogInformation("Tentativa de desativar todas as versões do template com ID original: {TemplateId}", templateId);

            var templateVersions = await _context.FormTemplates
                                        .Where(t => t.Id == templateId || t.Name == _context.FormTemplates.Where(rt => rt.Id == templateId).Select(rt => rt.Name).FirstOrDefault()) // Assumindo que o nome agrupa as versões
                                        .ToListAsync();

            if (!templateVersions.Any())
            {
                _logger.LogWarning("Nenhuma versão encontrada para o template com ID original: {TemplateId} para desativação.", templateId);
                return false;
            }

            bool hasActiveFilledForms = false;
            foreach (var version in templateVersions)
            {
                if (await _context.FilledFormInstances.AnyAsync(fi => fi.FormTemplateId == version.Id && fi.Status != Domain.Enums.Forms.FilledFormStatus.DRAFT_ON_DEVICE))
                {
                    // Se você quiser impedir a desativação se houver formulários preenchidos (exceto rascunhos)
                    // hasActiveFilledForms = true;
                    // break;
                }
            }

            if (hasActiveFilledForms)
            {
                _logger.LogWarning("Tentativa de desativar template ID: {TemplateId} que possui formulários preenchidos ativos.", templateId);
                throw new InvalidOperationException("Não é possível desativar um modelo de formulário que possui instâncias preenchidas e sincronizadas. Arquive as instâncias primeiro.");
            }


            foreach (var version in templateVersions)
            {
                version.IsActive = false;
                version.UpdatedAt = DateTime.UtcNow;
                _context.FormTemplates.Update(version);
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Todas as versões do template com ID original: {TemplateId} foram desativadas.", templateId);
            return true;
        }
    }
}