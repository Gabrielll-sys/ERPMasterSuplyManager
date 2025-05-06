// MasterErp.Services/DTOs/Forms/FormTemplateItemDto.cs
using MasterErp.Domain.Enums.Forms;

namespace MasterErp.Services.DTOs.Forms
{
    public class FormTemplateItemDto
    {
        public int Id { get; set; }
        public string Label { get; set; }
        public FormItemType ItemType { get; set; }
        public int Order { get; set; }
        public bool IsRequired { get; set; }
        public string? Placeholder { get; set; }
        public string? OptionsJson { get; set; } // Manter como string para flexibilidade
        public string? DefaultValue { get; set; }
    }
}