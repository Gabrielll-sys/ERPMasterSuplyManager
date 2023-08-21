using FluentValidation;
using SupplyManager.Models;
namespace SupplyManager.Validations.InventarioValidations
{
    public class InventarioPutValidator : AbstractValidator<Inventario>
    {

        public InventarioPutValidator() 
        {
            RuleFor(x => x.Id)
                    .GreaterThan(0)
                    .NotEmpty()
                    .WithMessage("O id precisa ser maior que 0 e não pode ser vazio");

            RuleFor(x => x.Descricao)
                .NotEmpty()
                .WithMessage("A descrição não pode ser vazia");
        
        }
    }
}
