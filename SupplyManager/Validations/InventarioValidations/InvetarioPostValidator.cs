using FluentValidation;
using SupplyManager.Models;

namespace SupplyManager.Validations.InventarioValidations
{
    public class InvetarioPostValidator:AbstractValidator<Inventario>
    {

       public InvetarioPostValidator()
        {
            RuleFor(x => x.Descricao)
                .NotEmpty()
                .WithMessage("A descrição não pode ser vazia");

            RuleFor(x => x.Codigo)
            .NotEmpty()
            .MinimumLength(4)
            .WithMessage("O código não pode ser vázio e precisa ter comprimento maior que 3 caracteres");

        }

    }
}
