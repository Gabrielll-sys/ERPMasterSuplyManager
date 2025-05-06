// Localização: MasterErp.Services/Validators/Forms/FormTemplateUpdateDtoValidator.cs
using FluentValidation;
using MasterErp.Services.DTOs.Forms;

namespace MasterErp.Services.Validators.Forms
{
    public class FormTemplateUpdateDtoValidator : AbstractValidator<FormTemplateUpdateDto>
    {
        public FormTemplateUpdateDtoValidator()
        {
            // As regras são geralmente as mesmas da criação, mas podem diferir
            // se alguns campos não puderem ser alterados após a criação inicial
            // ou se houver regras específicas para atualização.

            RuleFor(template => template.Name)
                .NotEmpty().WithMessage("O nome do modelo de formulário é obrigatório.")
                .MaximumLength(200).WithMessage("O nome do modelo de formulário não pode exceder 200 caracteres.");

            RuleFor(template => template.Description)
                .MaximumLength(1000).WithMessage("A descrição do modelo de formulário não pode exceder 1000 caracteres.");

            // IsActive é um booleano, geralmente não precisa de validação de formato,
            // mas pode ter regras de negócio (ex: não pode desativar se estiver em uso).
            // Essas regras de negócio são melhor tratadas no serviço.

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