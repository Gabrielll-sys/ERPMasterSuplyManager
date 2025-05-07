using MasterErp.Services.DTOs.Forms;

using System.ComponentModel.DataAnnotations;

/// <summary>
/// DTO para atualizar um modelo de formulário existente (FormTemplate).
/// Assume-se que uma atualização envia o estado completo e desejado do modelo.
/// Se uma nova versão for criada na atualização, o serviço lidará com isso.
/// </summary>
public class FormTemplateUpdateDto
{
    [Required(ErrorMessage = "O nome do modelo de formulário é obrigatório.")]
    [StringLength(200, ErrorMessage = "O nome do modelo não pode exceder 200 caracteres.")]
    public string Name { get; set; }

    [StringLength(1000, ErrorMessage = "A descrição não pode exceder 1000 caracteres.")]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    // Ao atualizar, você envia a estrutura completa de HeaderFields e Sections como deseja que fiquem.
    // O serviço determinará se isso constitui uma nova versão ou uma atualização no local (se permitido).
    public List<FormTemplateItemCreateDto> HeaderFields { get; set; } = new List<FormTemplateItemCreateDto>();
    public List<FormTemplateSectionCreateDto> Sections { get; set; } = new List<FormTemplateSectionCreateDto>();
}
