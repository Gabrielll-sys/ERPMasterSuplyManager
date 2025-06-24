// MasterErp.Services/DTOs/Forms/FilledItemResponseSyncDto.cs
using System;

namespace MasterErp.Services.DTOs.Forms
{
    public class FilledItemResponseSyncDto
    {
        public Guid Id { get; set; } // Guid do cliente
        public int FormTemplateItemId { get; set; }
        public string? ResponseValue { get; set; }
        public string? ObservationText { get; set; }
        public string? SignatureValueBase64 { get; set; }
    }
}