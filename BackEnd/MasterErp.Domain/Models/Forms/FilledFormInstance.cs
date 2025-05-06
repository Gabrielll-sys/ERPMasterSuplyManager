// MasterErp.Domain/Models/Forms/FilledFormInstance.cs
using MasterErp.Domain.Enums.Forms; // Criaremos este Enum abaixo
using MasterErp.Domain.Models; // Para referenciar Usuario
using System;
using System.Collections.Generic;

namespace MasterErp.Domain.Models.Forms
{
    public class FilledFormInstance
    {
        public Guid Id { get; set; } // PK - Gerado no cliente para suportar offline

        public int FormTemplateId { get; set; }
        public virtual FormTemplate FormTemplate { get; set; }
        public int FormTemplateVersion { get; set; }

        public int FilledByUserId { get; set; }
        public virtual Usuario FilledByUser { get; set; }

        public FilledFormStatus Status { get; set; }

        public DateTime DeviceCreatedAt { get; set; }
        public DateTime? DeviceSubmittedAt { get; set; }
        public DateTime? ServerReceivedAt { get; set; }

        public string HeaderDataJson { get; set; } // JSON: {"labelNormalizadaCampoCabecalho": "valor"}
        public string? GeneralObservations { get; set; }
        public string? SignatureBase64 { get; set; } // Se houver uma assinatura principal para o formulário
        public string? SyncErrorMessage { get; set; } // Para registrar erros de sincronização

        public virtual ICollection<FilledItemResponse> Responses { get; set; } = new List<FilledItemResponse>();
    }
}