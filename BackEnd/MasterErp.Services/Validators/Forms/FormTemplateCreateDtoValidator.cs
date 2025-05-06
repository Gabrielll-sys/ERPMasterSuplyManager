using FluentValidation;

using MasterErp.Services.Validators.Forms;

// Localização: MasterErp.Services / Validators / Forms / FormTemplateCreateDtoValidator.cs
using FluentValidation;
using MasterErp.Services.DTOs.Forms;

namespace MasterErp.Services.Validators.Forms
{
    public class FormTemplateCreateDtoValidator : AbstractValidator<FormTemplateCreateDto>
    {
        public FormTemplateCreateDtoValidator()
        {
            RuleFor(template => template.Name)
                .NotEmpty().WithMessage("O nome do modelo de formulário é obrigatório.")
                .MaximumLength(200).WithMessage("O nome do modelo de formulário não pode exceder 200 caracteres.");

            RuleFor(template => template.Description)
                .MaximumLength(1000).WithMessage("A descrição do modelo de formulário não pode exceder 1000 caracteres.");

            RuleFor(template => template.HeaderFields)
                .NotNull().WithMessage("A lista de campos de cabeçalho não pode ser nula.");
            // Validação implícita de cada item se configurado globalmente, ou usar:
            // .ForEach(hfRule => hfRule.SetValidator(new FormTemplateItemCreateDtoValidator()));

            RuleFor(template => template.Sections)
                .NotNull().WithMessage("A lista de seções não pode ser nula.");
            // Validação implícita de cada item se configurado globalmente, ou usar:
            // .ForEach(sectionRule => sectionRule.SetValidator(new FormTemplateSectionCreateDtoValidator()));
        }
    }
}