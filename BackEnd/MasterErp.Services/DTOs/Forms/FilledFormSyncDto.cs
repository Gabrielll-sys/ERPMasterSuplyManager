// MasterErp.Services/DTOs/Forms/FilledFormSyncDto.cs
using MasterErp.Domain.Enums.Forms;
using System;
using System.Collections.Generic;
using System.Text.Json; // Para Dictionary e manipulação de JSON

namespace MasterErp.Services.DTOs.Forms
{
    public class FilledFormSyncDto
    {
        public Guid Id { get; set; } // Guid do cliente
        public int FormTemplateId { get; set; }
        public int FormTemplateVersion { get; set; }
        // FilledByUserId será obtido do token JWT no backend
        public FilledFormStatus Status { get; set; } // App pode enviar PENDING_SYNC
        public DateTime DeviceCreatedAt { get; set; }
        public DateTime? DeviceSubmittedAt { get; set; }
        public string HeaderDataJson { get; set; } // Já vem como string JSON do mobile
        public string? GeneralObservations { get; set; }
        public string? SignatureBase64 { get; set; }
        public List<FilledItemResponseSyncDto> Responses { get; set; } = new List<FilledItemResponseSyncDto>();
    }
}