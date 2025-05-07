// Localização: MasterErp.Services/Services/Forms/FilledFormService.cs
using AutoMapper;
using AutoMapper.QueryableExtensions; // Para ProjectTo
using MasterErp.Domain.Models.Forms;
using MasterErp.Domain.Enums.Forms;
using MasterErp.Infraestructure.Context;
using MasterErp.Services.DTOs.Forms;
using MasterErp.Services.Interfaces.Forms;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json; // Para desserializar HeaderDataJson
using System.Threading.Tasks;

namespace MasterErp.Services.Services.Forms
{
    public class FilledFormService : IFilledFormService
    {
        private readonly SqlContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<FilledFormService> _logger;

        public FilledFormService(SqlContext context, IMapper mapper, ILogger<FilledFormService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<BatchSyncResponseDto> ProcessSyncBatchAsync(List<FilledFormSyncDto> formsToSync, int filledByUserId)
        {
            // A implementação desta já foi fornecida anteriormente e está correta.
            // Vou copiar aqui para manter a classe completa.
            _logger.LogInformation("Processando lote de sincronização de {Count} formulários para o usuário ID: {UserId}", formsToSync.Count, filledByUserId);
            var batchResponse = new BatchSyncResponseDto();

            foreach (var formDto in formsToSync)
            {
                var responseItem = new SyncResponseItemDto { ClientId = formDto.Id };
                using var transaction = await _context.Database.BeginTransactionAsync(); // Transação por formulário
                try
                {
                    var templateExists = await _context.FormTemplates
                        .AnyAsync(ft => ft.Id == formDto.FormTemplateId && ft.Version == formDto.FormTemplateVersion && ft.IsActive);

                    if (!templateExists)
                    {
                        _logger.LogWarning("Template de formulário ID: {TemplateId}, Versão: {Version} não encontrado ou inativo para o ClientFormID: {ClientFormId}",
                            formDto.FormTemplateId, formDto.FormTemplateVersion, formDto.Id);
                        responseItem.Success = false;
                        responseItem.Message = $"Template (ID: {formDto.FormTemplateId}, Versão: {formDto.FormTemplateVersion}) não encontrado ou inativo.";
                        batchResponse.Results.Add(responseItem);
                        await transaction.RollbackAsync();
                        continue;
                    }

                    var existingInstance = await _context.FilledFormInstances
                                                    .Include(fi => fi.Responses)
                                                    .FirstOrDefaultAsync(fi => fi.Id == formDto.Id);

                    if (existingInstance != null)
                    {
                        if (existingInstance.Status == FilledFormStatus.SYNCED_TO_SERVER && existingInstance.ServerReceivedAt >= formDto.DeviceSubmittedAt)
                        {
                            _logger.LogInformation("Formulário ClientID: {ClientFormId} já está sincronizado com uma versão igual ou mais recente. Pulando.", formDto.Id);
                            responseItem.Success = true;
                            responseItem.Message = "Já sincronizado com versão igual ou mais recente.";
                            responseItem.ServerId = existingInstance.Id;
                            batchResponse.Results.Add(responseItem);
                            await transaction.CommitAsync(); // Commit mesmo se pular
                            continue;
                        }

                        _mapper.Map(formDto, existingInstance);
                        existingInstance.FilledByUserId = filledByUserId;
                        existingInstance.ServerReceivedAt = DateTime.UtcNow;
                        existingInstance.Status = FilledFormStatus.SYNCED_TO_SERVER;
                        existingInstance.SyncErrorMessage = null;

                        // Estratégia para atualizar respostas: remover antigas e adicionar novas
                        _context.FilledItemResponses.RemoveRange(existingInstance.Responses);
                        existingInstance.Responses.Clear(); // Limpa a coleção na entidade

                        foreach (var responseDto in formDto.Responses)
                        {
                            var newResponse = _mapper.Map<FilledItemResponse>(responseDto);
                            // newResponse.FilledFormInstanceId = existingInstance.Id; // O EF Core deve lidar com isso ao adicionar à coleção
                            existingInstance.Responses.Add(newResponse);
                        }
                        _logger.LogInformation("Formulário ClientID: {ClientFormId} atualizado no servidor.", formDto.Id);
                    }
                    else
                    {
                        var newInstance = _mapper.Map<FilledFormInstance>(formDto);
                        newInstance.FilledByUserId = filledByUserId;
                        newInstance.ServerReceivedAt = DateTime.UtcNow;
                        newInstance.Status = FilledFormStatus.SYNCED_TO_SERVER;

                        _context.FilledFormInstances.Add(newInstance);
                        _logger.LogInformation("Formulário ClientID: {ClientFormId} criado no servidor.", formDto.Id);
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    responseItem.Success = true;
                    responseItem.Message = "Sincronizado com sucesso.";
                    responseItem.ServerId = formDto.Id;
                    batchResponse.Results.Add(responseItem);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Erro ao sincronizar formulário ClientID: {ClientFormId}. Erro: {ErrorMessage}", formDto.Id, ex.Message);
                    responseItem.Success = false;
                    responseItem.Message = $"Erro interno: {ex.Message}";
                    responseItem.ServerId = formDto.Id;
                    batchResponse.Results.Add(responseItem);
                }
            }
            return batchResponse;
        }

        public async Task<IEnumerable<FilledFormInstanceListItemDto>> GetFilledFormsAsync(
            int? templateId, int? filledByUserIdFilter, DateTime? startDate, DateTime? endDate,
            string? status, int page, int pageSize, int requestingUserId, bool isUserAdminOrManager)
        {
            _logger.LogInformation("Buscando formulários preenchidos. Solicitante ID: {RequestingUserId}, Admin/Manager: {IsAdmin}", requestingUserId, isUserAdminOrManager);

            var query = _context.FilledFormInstances.AsNoTracking();

            if (!isUserAdminOrManager)
            {
                // Usuário comum só pode ver os seus próprios formulários
                query = query.Where(fi => fi.FilledByUserId == requestingUserId);
            }
            else if (filledByUserIdFilter.HasValue)
            {
                // Admin/Manager pode filtrar por usuário específico
                query = query.Where(fi => fi.FilledByUserId == filledByUserIdFilter.Value);
            }

            if (templateId.HasValue)
            {
                query = query.Where(fi => fi.FormTemplateId == templateId.Value);
            }
            if (startDate.HasValue)
            {
                query = query.Where(fi => fi.DeviceSubmittedAt >= startDate.Value || fi.DeviceCreatedAt >= startDate.Value);
            }
            if (endDate.HasValue)
            {
                query = query.Where(fi => fi.DeviceSubmittedAt <= endDate.Value || fi.DeviceCreatedAt <= endDate.Value);
            }
            if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<FilledFormStatus>(status, true, out var statusEnum))
            {
                query = query.Where(fi => fi.Status == statusEnum);
            }

            // Ordenação padrão
            query = query.OrderByDescending(fi => fi.DeviceSubmittedAt ?? fi.DeviceCreatedAt);

            // Paginação
            var pagedQuery = query.Skip((page - 1) * pageSize).Take(pageSize);

            // Projeção para o DTO. O mapeamento de HeaderDataJson para campos específicos
            // como OrdemServico e Equipamento precisa ser feito no Profile do AutoMapper
            // ou manualmente aqui se for complexo.
            // Por simplicidade, vamos assumir que o AutoMapper pode ser configurado para isso.
            // Se não, você faria algo como:
            // var results = await pagedQuery.ToListAsync();
            // return results.Select(fi => {
            //     var dto = _mapper.Map<FilledFormInstanceListItemDto>(fi);
            //     // Lógica para extrair de fi.HeaderDataJson para dto.OrdemServico, etc.
            //     return dto;
            // });

            return await pagedQuery
                .ProjectTo<FilledFormInstanceListItemDto>(_mapper.ConfigurationProvider) // Usa AutoMapper.QueryableExtensions
                .ToListAsync();
        }

        public async Task<FilledFormInstanceDetailDto?> GetFilledFormDetailAsync(
            Guid instanceId, int requestingUserId, bool isUserAdminOrManager)
        {
            _logger.LogInformation("Buscando detalhes do formulário preenchido ID: {InstanceId}. Solicitante ID: {RequestingUserId}, Admin/Manager: {IsAdmin}", instanceId, requestingUserId, isUserAdminOrManager);

            var query = _context.FilledFormInstances
                .AsNoTracking()
                .Include(fi => fi.FormTemplate) // Para pegar o nome do template
                .Include(fi => fi.FilledByUser) // Para pegar o nome do usuário
                .Include(fi => fi.Responses)
                    .ThenInclude(r => r.FormTemplateItem) // Para pegar o label do item do template
                .Where(fi => fi.Id == instanceId);

            var instance = await query.FirstOrDefaultAsync();

            if (instance == null)
            {
                _logger.LogWarning("Formulário preenchido ID: {InstanceId} não encontrado.", instanceId);
                return null;
            }

            if (!isUserAdminOrManager && instance.FilledByUserId != requestingUserId)
            {
                _logger.LogWarning("Usuário ID: {RequestingUserId} tentou aceder ao formulário ID: {InstanceId} sem permissão.", requestingUserId, instanceId);
                throw new UnauthorizedAccessException("Você não tem permissão para visualizar este formulário.");
            }

            return _mapper.Map<FilledFormInstanceDetailDto>(instance);
        }
    }
}