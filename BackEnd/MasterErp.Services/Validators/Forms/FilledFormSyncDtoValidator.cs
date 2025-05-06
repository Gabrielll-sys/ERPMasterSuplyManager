// MasterErp.Services/Validators/Forms/FilledFormSyncDtoValidator.cs
using FluentValidation;
using MasterErp.Services.DTOs.Forms;
using System.Text.Json; // Para validar JSON

namespace MasterErp.Services.Validators.Forms
{
    public class FilledFormSyncDtoValidator : AbstractValidator<FilledFormSyncDto>
    {
        public FilledFormSyncDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("O ID do formulário preenchido (cliente) é obrigatório.");

            RuleFor(x => x.FormTemplateId)
                .GreaterThan(0).WithMessage("O ID do modelo de formulário é obrigatório.");

            RuleFor(x => x.FormTemplateVersion)
                .GreaterThan(0).WithMessage("A versão do modelo de formulário é obrigatória.");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Status inválido.");

            RuleFor(x => x.DeviceCreatedAt)
                .NotEmpty().WithMessage("Data de criação no dispositivo é obrigatória.")
                .LessThanOrEqualTo(System.DateTime.UtcNow.AddHours(1)).WithMessage("Data de criação no dispositivo parece inválida."); // Uma checagem básica

            RuleFor(x => x.DeviceSubmittedAt)
                .LessThanOrEqualTo(System.DateTime.UtcNow.AddHours(1))
                .When(x => x.DeviceSubmittedAt.HasValue)
                .WithMessage("Data de submissão no dispositivo parece inválida.");

            RuleFor(x => x.HeaderDataJson)
                .NotEmpty().WithMessage("Dados do cabeçalho são obrigatórios.")
                .Must(BeValidJson).WithMessage("Formato JSON inválido para dados do cabeçalho.");

            RuleFor(x => x.Responses)
                .NotNull().WithMessage("A lista de respostas não pode ser nula.")
                .ForEach(responseRule =>
                {
                    responseRule.SetValidator(new FilledItemResponseSyncDtoValidator());
                });

            RuleFor(x => x.GeneralObservations)
                .MaximumLength(8000).WithMessage("Observações gerais excedem o tamanho máximo.");

            RuleFor(x => x.SignatureBase64)
                 .Matches(@"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$")
                 .When(x => !string.IsNullOrEmpty(x.SignatureBase64))
                 .WithMessage("Formato inválido para assinatura principal em base64.");
        }

        private bool BeValidJson(string jsonString)
        {
            if (string.IsNullOrWhiteSpace(jsonString)) return false; // Ou true se JSON vazio for aceitável
            try
            {
                JsonDocument.Parse(jsonString);
                return true;
            }
            catch (JsonException)
            {
                return false;
            }
        }
    }
}