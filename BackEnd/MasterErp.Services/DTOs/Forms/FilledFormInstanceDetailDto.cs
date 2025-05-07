// Localização: MasterErp.Services/DTOs/Forms/FilledFormInstanceDetailDto.cs
using System;
using System.Collections.Generic;
using MasterErp.Domain.Enums.Forms; // Certifique-se que este using está correto

namespace MasterErp.Services.DTOs.Forms
{
    /// <summary>
    /// DTO para exibir os detalhes completos de uma instância de formulário preenchido.
    /// </summary>
    public class FilledFormInstanceDetailDto
    {
        public Guid Id { get; set; }
        public int FormTemplateId { get; set; }
        public string FormTemplateName { get; set; } // Para conveniência
        public int FormTemplateVersion { get; set; }

        public int FilledByUserId { get; set; }
        public string FilledByUserName { get; set; } // Para conveniência

        public FilledFormStatus Status { get; set; }
        public DateTime DeviceCreatedAt { get; set; }
        public DateTime? DeviceSubmittedAt { get; set; }
        public DateTime? ServerReceivedAt { get; set; }

        // HeaderDataJson pode ser retornado como string ou desserializado para um objeto dinâmico/dicionário
        public string HeaderDataJson { get; set; } // Ou: public Dictionary<string, string> HeaderData { get; set; }

        public string? GeneralObservations { get; set; }
        public string? SignatureBase64 { get; set; } // Assinatura principal do formulário
        public string? SyncErrorMessage { get; set; }

     
        public List<FilledItemResponseSyncDto> Responses { get; set; } = new List<FilledItemResponseSyncDto>();

        // Opcional: Incluir a estrutura do template usado para preencher, para referência.
        // public FormTemplateDetailDto TemplateStructureUsed { get; set; }
    }
}