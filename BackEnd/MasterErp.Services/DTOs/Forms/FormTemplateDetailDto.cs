// MasterErp.Services/DTOs/Forms/FormTemplateDetailDto.cs
using System.Collections.Generic;

namespace MasterErp.Services.DTOs.Forms
{
    public class FormTemplateDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Version { get; set; }
        public string? Description { get; set; }
        public List<FormTemplateItemDto> HeaderFields { get; set; } = new List<FormTemplateItemDto>();
        public List<FormTemplateSectionDto> Sections { get; set; } = new List<FormTemplateSectionDto>();
    }
}