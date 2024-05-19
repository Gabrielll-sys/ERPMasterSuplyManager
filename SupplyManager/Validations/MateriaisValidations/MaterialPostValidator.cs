using FluentValidation;
using SupplyManager.Models;

namespace SupplyManager.Validations.MateriaisValidations
{
    public class MaterialPostValidator:AbstractValidator<Material>
    {

        public MaterialPostValidator() {
            RuleFor(x => x.Descricao)
                .NotNull()
                .MinimumLength(4)
                .WithMessage("Descrição não pode ser vazia e precisa ter comprimento maior que 3 letras");



            RuleFor(x => x.Unidade)
                .NotEmpty()
                .WithMessage("Unidade não pode ser vazia");


            RuleFor(x => x.Markup)
                .GreaterThan(0)
                .WithMessage("O Markup precisa ser maior que 0");
            
        
        }
    }
}
