// MasterErp.Services/DTOs/Forms/FormTemplateBasicDto.cs
namespace MasterErp.Services.DTOs.Forms
{
    public class FormTemplateBasicDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Version { get; set; }
        public string? Description { get; set; }
    }
}