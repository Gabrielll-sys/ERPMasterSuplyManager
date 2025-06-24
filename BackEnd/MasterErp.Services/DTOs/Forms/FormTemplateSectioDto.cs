// MasterErp.Services/DTOs/Forms/FormTemplateSectionDto.cs
using System.Collections.Generic;

namespace MasterErp.Services.DTOs.Forms
{
    public class FormTemplateSectionDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public List<FormTemplateItemDto> Items { get; set; } = new List<FormTemplateItemDto>();
    }
}