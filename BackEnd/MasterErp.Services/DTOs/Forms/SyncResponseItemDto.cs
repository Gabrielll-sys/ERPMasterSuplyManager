// MasterErp.Services/DTOs/Forms/SyncResponseDto.cs
using System;
namespace MasterErp.Services.DTOs.Forms
{
    public class SyncResponseItemDto
    {
        public Guid ClientId { get; set; } // O ID que o cliente enviou
        public bool Success { get; set; }
        public string? Message { get; set; } // Mensagem de erro ou sucesso
        public Guid? ServerId { get; set; } // O ID do registro no servidor (se for novo)
    }

    public class BatchSyncResponseDto
    {
        public List<SyncResponseItemDto> Results { get; set; } = new List<SyncResponseItemDto>();
        public bool OverallSuccess => Results.All(r => r.Success);
    }
}