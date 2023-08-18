using FluentValidation;
using SupplyManager.Models;

namespace SupplyManager.Validations
{
    public class CategoriaPostValidation: AbstractValidator<Categoria>
    {

        public CategoriaPostValidation()
        {
            RuleFor(x => x.MaterialId).GreaterThan(0).NotEmpty().WithMessage("FK do material não pode ser negativa");
            RuleFor(x => x.NomeCategoria).NotEmpty().WithMessage("Nome da categoria não pode ser vazia");

        }
    }
}
