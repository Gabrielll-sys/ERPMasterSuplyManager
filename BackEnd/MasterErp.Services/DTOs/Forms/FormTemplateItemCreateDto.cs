// Localização: MasterErp.Services/DTOs/Forms/FormTemplateItemCreateDto.cs
using MasterErp.Domain.Enums.Forms; // Certifique-se que este using está correto
using System.ComponentModel.DataAnnotations;

namespace MasterErp.Services.DTOs.Forms
{
    /// <summary>
    /// DTO para definir um item (campo ou pergunta) ao criar um modelo de formulário.
    /// Usado tanto para HeaderFields quanto para itens dentro de seções.
    /// </summary>
    public class FormTemplateItemCreateDto
    {
        [Required(ErrorMessage = "A etiqueta do item é obrigatória.")]
        [StringLength(500, ErrorMessage = "A etiqueta do item não pode exceder 500 caracteres.")]
        public string Label { get; set; }

        [Required(ErrorMessage = "O tipo do item é obrigatório.")]
        public FormItemType ItemType { get; set; } // Enum: TEXT_SHORT, OK_NC_OBS, etc.

        [Range(1, int.MaxValue, ErrorMessage = "A ordem do item deve ser um número positivo.")]
        public int Order { get; set; }

        public bool IsRequired { get; set; } = false;

        [StringLength(200, ErrorMessage = "O placeholder não pode exceder 200 caracteres.")]
        public string? Placeholder { get; set; }

        // Para tipos como DROPDOWN, RADIO, etc. Armazena as opções como um array JSON stringificado.
        // Ex: "[{\"value\":\"opt1\", \"label\":\"Opção 1\"}, {\"value\":\"opt2\", \"label\":\"Opção 2\"}]"
        public string? OptionsJson { get; set; }

        [StringLength(1000, ErrorMessage = "O valor padrão não pode exceder 1000 caracteres.")]
        public string? DefaultValue { get; set; }
    }    
}
