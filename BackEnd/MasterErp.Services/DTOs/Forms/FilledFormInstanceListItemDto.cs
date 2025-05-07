using System;
using MasterErp.Domain.Enums.Forms; // Certifique-se que este using está correto

namespace MasterErp.Services.DTOs.Forms
{
    /// <summary>
    /// DTO para exibir informações resumidas de uma instância de formulário preenchido numa lista.
    /// </summary>
    public class FilledFormInstanceListItemDto
    {
        public Guid Id { get; set; } // ID da instância preenchida
        public string FormTemplateName { get; set; } // Nome do modelo de formulário usado
        public int FormTemplateVersion { get; set; }
        public string FilledByUserName { get; set; } // Nome do usuário que preencheu
        public DateTime DeviceSubmittedAt { get; set; } // Data de submissão no dispositivo
        public DateTime? ServerReceivedAt { get; set; } // Data de recebimento no servidor
        public FilledFormStatus Status { get; set; }

        // Informações do cabeçalho que são relevantes para a listagem (exemplo)
        // Você precisará decidir quais campos do HeaderDataJson são importantes aqui.
        // Exemplo: Se o cabeçalho sempre tem "OrdemServico" e "Equipamento"
        public string? OrdemServico { get; set; }
        public string? Equipamento { get; set; }
    }
}