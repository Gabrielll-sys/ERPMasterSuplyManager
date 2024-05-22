using FluentValidation;
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Validations.InventarioValidations
{
    public class InventarioIdValidator : AbstractValidator<int?>
    {
        public InventarioIdValidator()
        {

            RuleFor(x => x)
                .NotEqual(0)
                .WithName("Id")
                .WithMessage("Id não pode ser vazio e precisa ser maior que 0");

        }

    }
}
