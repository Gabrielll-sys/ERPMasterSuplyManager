// Localização: MasterErp.Services/Mappings/Forms/FormMappingProfile.cs
using AutoMapper;
using MasterErp.Domain.Models.Forms;
using MasterErp.Domain.Models; // Para Usuario (se referenciado diretamente)
using MasterErp.Services.DTOs.Forms;
using System.Linq;
using System.Text.Json; // Para JsonSerializer
using System.Collections.Generic; // Para Dictionary

namespace MasterErp.Services.Mappings.Forms
{
    public class FormMappingProfile : Profile
    {
        public FormMappingProfile()
        {
            // Mapeamentos para FormTemplate (Modelos de Formulário)
            // ======================================================

            // DTO para criar um item de template -> Entidade Item de Template
            CreateMap<FormTemplateItemCreateDto, FormTemplateItem>();

            // DTO para criar uma seção de template -> Entidade Seção de Template
            CreateMap<FormTemplateSectionCreateDto, FormTemplateSection>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items)); // Mapeia a lista de itens

            // DTO para criar um template -> Entidade Template
            CreateMap<FormTemplateCreateDto, FormTemplate>()
                .ForMember(dest => dest.HeaderFields, opt => opt.MapFrom(src => src.HeaderFields))
                .ForMember(dest => dest.Sections, opt => opt.MapFrom(src => src.Sections))
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // Id é gerado pelo banco
                .ForMember(dest => dest.Version, opt => opt.Ignore()) // Definido pelo serviço
                .ForMember(dest => dest.IsActive, opt => opt.Ignore()) // Definido pelo serviço
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Definido pelo serviço
                .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore()); // Definido pelo serviço

            // DTO para atualizar um template -> Entidade Template (para criar nova versão)
            CreateMap<FormTemplateUpdateDto, FormTemplate>()
                .ForMember(dest => dest.HeaderFields, opt => opt.MapFrom(src => src.HeaderFields))
                .ForMember(dest => dest.Sections, opt => opt.MapFrom(src => src.Sections))
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // Nova versão terá novo Id
                .ForMember(dest => dest.Version, opt => opt.Ignore()) // Definido pelo serviço
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Definido pelo serviço (data de criação da nova versão)
                .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore()); // Definido pelo serviço (usuário que atualizou)

            // Entidade Item de Template -> DTO Item de Template (para detalhes)
            CreateMap<FormTemplateItem, FormTemplateItemDto>();

            // Entidade Seção de Template -> DTO Seção de Template (para detalhes)
            CreateMap<FormTemplateSection, FormTemplateSectionDto>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items.OrderBy(i => i.Order)));

            // Entidade Template -> DTO Detalhes do Template
            CreateMap<FormTemplate, FormTemplateDetailDto>()
                 .ForMember(dest => dest.HeaderFields, opt => opt.MapFrom(src => src.HeaderFields.OrderBy(hf => hf.Order)))
                 .ForMember(dest => dest.Sections, opt => opt.MapFrom(src => src.Sections.OrderBy(s => s.Order)));

            // Entidade Template -> DTO Básico do Template (para listas)
            CreateMap<FormTemplate, FormTemplateBasicDto>();


            // Mapeamentos para FilledFormInstance (Instâncias de Formulários Preenchidos)
            // ============================================================================

            // DTO de sincronização de resposta de item -> Entidade Resposta de Item
            CreateMap<FilledItemResponseSyncDto, FilledItemResponse>()
                // O Id (PK) do FilledItemResponse é o mesmo Guid gerado no cliente.
                // FilledFormInstanceId será definido manualmente no serviço ao adicionar à coleção da instância pai.
                .ForMember(dest => dest.FilledFormInstanceId, opt => opt.Ignore())
                .ForMember(dest => dest.FormTemplateItem, opt => opt.Ignore()); // Não mapear navegação de volta


            // DTO de sincronização de formulário -> Entidade Instância de Formulário (para criação)
            CreateMap<FilledFormSyncDto, FilledFormInstance>()
                // O Id (PK) do FilledFormInstance é o mesmo Guid gerado no cliente.
                .ForMember(dest => dest.FilledByUserId, opt => opt.Ignore()) // Será definido pelo usuário do token no serviço
                .ForMember(dest => dest.ServerReceivedAt, opt => opt.Ignore()) // Definido pelo serviço
                .ForMember(dest => dest.FormTemplate, opt => opt.Ignore()) // Não mapear navegação
                .ForMember(dest => dest.FilledByUser, opt => opt.Ignore())  // Não mapear navegação
                .ForMember(dest => dest.SyncErrorMessage, opt => opt.Ignore()) // Controlado pelo serviço
                .ForMember(dest => dest.Responses, opt => opt.MapFrom(src => src.Responses)); // Mapeia a lista de respostas

            // DTO de sincronização de formulário -> Entidade Instância de Formulário (para atualização, usando MemberList.Source)
            CreateMap<FilledFormSyncDto, FilledFormInstance>(MemberList.Source)
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // PK não deve ser alterada
                .ForMember(dest => dest.FilledByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.ServerReceivedAt, opt => opt.Ignore())
                .ForMember(dest => dest.FormTemplateId, opt => opt.Ignore()) // Não deve mudar
                .ForMember(dest => dest.FormTemplateVersion, opt => opt.Ignore()) // Não deve mudar
                .ForMember(dest => dest.FormTemplate, opt => opt.Ignore())
                .ForMember(dest => dest.FilledByUser, opt => opt.Ignore())
                .ForMember(dest => dest.SyncErrorMessage, opt => opt.Ignore())
                // Responses são tratadas manualmente no serviço (limpar e adicionar) para atualizações
                .ForMember(dest => dest.Responses, opt => opt.Ignore());


            // Entidade Instância de Formulário -> DTO Item de Lista de Instância de Formulário
            CreateMap<FilledFormInstance, FilledFormInstanceListItemDto>()
                .ForMember(dest => dest.FormTemplateName, opt => opt.MapFrom(src => src.FormTemplate != null ? src.FormTemplate.Name : "N/A"))
                .ForMember(dest => dest.FilledByUserName, opt => opt.MapFrom(src => src.FilledByUser != null ? src.FilledByUser.Nome : "N/A")) // Assumindo que Usuario tem a propriedade Nome
                .ForMember(dest => dest.OrdemServico, opt => opt.MapFrom(src => GetJsonValue(src.HeaderDataJson, "ordem_servico"))) // Chave deve ser consistente
                .ForMember(dest => dest.Equipamento, opt => opt.MapFrom(src => GetJsonValue(src.HeaderDataJson, "equipamento")));  // Chave deve ser consistente

            // Entidade Instância de Formulário -> DTO Detalhes da Instância de Formulário
            CreateMap<FilledFormInstance, FilledFormInstanceDetailDto>()
                .ForMember(dest => dest.FormTemplateName, opt => opt.MapFrom(src => src.FormTemplate != null ? src.FormTemplate.Name : "N/A"))
                .ForMember(dest => dest.FilledByUserName, opt => opt.MapFrom(src => src.FilledByUser != null ? src.FilledByUser.Nome : "N/A"))
                // Responses são mapeadas de FilledItemResponse para FilledItemResponseSyncDto (ou um DTO de leitura específico)
                .ForMember(dest => dest.Responses, opt => opt.MapFrom(src => src.Responses));

            // Entidade Resposta de Item -> DTO de Sincronização de Resposta de Item (para leitura nos detalhes)
            // Se FilledItemResponseSyncDto for usado para leitura, este mapeamento é necessário.
            // Se você criar um FilledItemResponseReadDto, mapeie para ele.
            CreateMap<FilledItemResponse, FilledItemResponseSyncDto>()
                .ForMember(dest => dest.FormTemplateItemId, opt => opt.MapFrom(src => src.FormTemplateItemId));
            // Adicionar .ForMember(dest => dest.ItemLabel, opt => opt.MapFrom(src => src.FormTemplateItem.Label))
            // se você adicionar ItemLabel ao FilledItemResponseSyncDto e quiser o label do item original.

        }

        // Função helper para desserializar JSON e obter um valor de forma segura
        private string? GetJsonValue(string jsonString, string propertyName)
        {
            if (string.IsNullOrWhiteSpace(jsonString))
                return null;

            try
            {
                using (JsonDocument document = JsonDocument.Parse(jsonString))
                {
                    if (document.RootElement.TryGetProperty(propertyName, out JsonElement element))
                    {
                        return element.ValueKind == JsonValueKind.String ? element.GetString() : element.ToString();
                    }
                }
            }
            catch (JsonException)
            {
                // Logar o erro se necessário, mas retornar null para não quebrar o mapeamento
                return null;
            }
            return null;
        }
    }
}
