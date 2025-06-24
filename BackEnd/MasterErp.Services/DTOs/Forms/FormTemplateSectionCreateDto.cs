using MasterErp.Services.DTOs.Forms;

using System.ComponentModel.DataAnnotations;

/// <summary>
/// DTO para definir uma seção ao criar um modelo de formulário.
/// </summary>
public class FormTemplateSectionCreateDto
{
    [Required(ErrorMessage = "O nome da seção é obrigatório.")]
    [StringLength(200, ErrorMessage = "O nome da seção não pode exceder 200 caracteres.")]
    public string Name { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "A ordem da seção deve ser um número positivo.")]
    public int Order { get; set; }

    public List<FormTemplateItemCreateDto> Items { get; set; } = new List<FormTemplateItemCreateDto>();
}
