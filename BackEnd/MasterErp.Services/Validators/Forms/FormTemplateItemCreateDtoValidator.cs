// Localização: MasterErp.Services/Validators/Forms/FormTemplateItemCreateDtoValidator.cs
using FluentValidation;
using MasterErp.Services.DTOs.Forms;
using MasterErp.Domain.Enums.Forms; // Certifique-se de que este using está correto

namespace MasterErp.Services.Validators.Forms
{
    public class FormTemplateItemCreateDtoValidator : AbstractValidator<FormTemplateItemCreateDto>
    {
        public FormTemplateItemCreateDtoValidator()
        {
            RuleFor(item => item.Label)
                .NotEmpty().WithMessage("A etiqueta do item do template é obrigatória.")
                .MaximumLength(500).WithMessage("A etiqueta do item do template não pode exceder 500 caracteres.");

            RuleFor(item => item.ItemType)
                .IsInEnum().WithMessage("O tipo do item do template é inválido.");

            RuleFor(item => item.Order)
                .GreaterThan(0).WithMessage("A ordem do item do template deve ser um número positivo.");

            RuleFor(item => item.Placeholder)
                .MaximumLength(200).WithMessage("O placeholder do item não pode exceder 200 caracteres.");

            RuleFor(item => item.OptionsJson)
                .MaximumLength(2000).WithMessage("As opções JSON não podem exceder 2000 caracteres.")
                // Adicionar uma validação para verificar se é um JSON válido se OptionsJson não for nulo
                .Must(BeValidJsonOrNull).WithMessage("OptionsJson deve ser uma string JSON válida ou nula.");
               

            RuleFor(item => item.DefaultValue)
                .MaximumLength(1000).WithMessage("O valor padrão do item não pode exceder 1000 caracteres.");
        }

        private bool BeValidJsonOrNull(string? jsonString)
        {
            if (string.IsNullOrWhiteSpace(jsonString))
            {
                return true; // Nulo ou vazio é permitido
            }
            try
            {
                System.Text.Json.JsonDocument.Parse(jsonString);
                return true;
            }
            catch (System.Text.Json.JsonException)
            {
                return false;
            }
        }
    }
}