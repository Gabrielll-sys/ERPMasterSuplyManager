// MasterErp.Domain/Models/Forms/FilledItemResponse.cs
using System;

namespace MasterErp.Domain.Models.Forms
{
    public class FilledItemResponse
    {
        public Guid Id { get; set; } // PK - Gerado no cliente

        public Guid FilledFormInstanceId { get; set; }
        public virtual FilledFormInstance FilledFormInstance { get; set; }

        public int FormTemplateItemId { get; set; } // ID do item do modelo
        public virtual FormTemplateItem FormTemplateItem { get; set; }

        public string? ResponseValue { get; set; } // Ex: "OK", "NC", "YES", "NO", texto, número, data ISO
        public string? ObservationText { get; set; } // Para o campo observação de um item OK_NC_OBS ou similar
        public string? SignatureValueBase64 { get; set; } // Para o caso de um FormTemplateItem ser do tipo SIGNATURE
    }
}