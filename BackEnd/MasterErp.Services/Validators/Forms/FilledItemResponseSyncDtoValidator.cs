// MasterErp.Services/Validators/Forms/FilledItemResponseSyncDtoValidator.cs
using FluentValidation;
using MasterErp.Services.DTOs.Forms;

namespace MasterErp.Services.Validators.Forms
{
    public class FilledItemResponseSyncDtoValidator : AbstractValidator<FilledItemResponseSyncDto>
    {
        public FilledItemResponseSyncDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("O ID da resposta do item (cliente) é obrigatório.");

            RuleFor(x => x.FormTemplateItemId)
                .GreaterThan(0).WithMessage("O ID do item do modelo de formulário é obrigatório.");

            // ResponseValue pode ser nulo dependendo do tipo de item e se é obrigatório ou não.
            // Validações mais específicas (ex: se é OK/NC, o valor deve ser "OK" ou "NC")
            // podem ser complexas aqui e talvez melhor tratadas no serviço ou
            // com regras condicionais baseadas no FormTemplateItem.ItemType (que não está no DTO direto).
            // Por agora, uma validação genérica:
            RuleFor(x => x.ResponseValue)
                .MaximumLength(4000).WithMessage("O valor da resposta excede o tamanho máximo.");

            RuleFor(x => x.ObservationText)
                .MaximumLength(4000).WithMessage("O texto da observação excede o tamanho máximo.");

            RuleFor(x => x.SignatureValueBase64)
                 .Matches(@"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$")
                 .When(x => !string.IsNullOrEmpty(x.SignatureValueBase64))
                 .WithMessage("Formato inválido para assinatura em base64.");
        }
    }
}