// Localização: MasterErp.Services/Validators/Forms/FormTemplateSectionCreateDtoValidator.cs
using FluentValidation;
using MasterErp.Services.DTOs.Forms;

namespace MasterErp.Services.Validators.Forms
{
    public class FormTemplateSectionCreateDtoValidator : AbstractValidator<FormTemplateSectionCreateDto>
    {
        public FormTemplateSectionCreateDtoValidator()
        {
            RuleFor(section => section.Name)
                .NotEmpty().WithMessage("O nome da seção do template é obrigatório.")
                .MaximumLength(200).WithMessage("O nome da seção do template não pode exceder 200 caracteres.");

            RuleFor(section => section.Order)
                .GreaterThan(0).WithMessage("A ordem da seção do template deve ser um número positivo.");

            RuleFor(section => section.Items)
                .NotNull().WithMessage("A lista de itens da seção não pode ser nula.");
            // Valida cada item na coleção usando o validador definido para FormTemplateItemCreateDto
            // Removido o SetValidator aqui, pois o FluentValidation pode lidar com isso implicitamente
            // se RegisterValidatorsFromAssemblyContaining for usado e ImplicitlyValidateChildProperties = true.
            // Se não, pode ser necessário: .ForEach(itemRule => itemRule.SetValidator(new FormTemplateItemCreateDtoValidator()));
        }
    }
}