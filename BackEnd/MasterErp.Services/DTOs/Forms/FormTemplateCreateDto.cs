using MasterErp.Services.DTOs.Forms;

using System.ComponentModel.DataAnnotations;

/// <summary>
/// DTO para criar um novo modelo de formulário (FormTemplate).
/// </summary>
public class FormTemplateCreateDto
{
    [Required(ErrorMessage = "O nome do modelo de formulário é obrigatório.")]
    [StringLength(200, ErrorMessage = "O nome do modelo não pode exceder 200 caracteres.")]
    public string Name { get; set; }

    [StringLength(1000, ErrorMessage = "A descrição não pode exceder 1000 caracteres.")]
    public string? Description { get; set; }

    // A versão será definida pelo serviço, começando em 1.
    // IsActive será true por padrão.

    public List<FormTemplateItemCreateDto> HeaderFields { get; set; } = new List<FormTemplateItemCreateDto>();
    public List<FormTemplateSectionCreateDto> Sections { get; set; } = new List<FormTemplateSectionCreateDto>();
}
