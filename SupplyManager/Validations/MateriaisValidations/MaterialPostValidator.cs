using FluentValidation;
using SupplyManager.Models;

namespace SupplyManager.Validations.MateriaisValidations
{
    public class MaterialPostValidator:AbstractValidator<Material>
    {

        public MaterialPostValidator() {
            RuleFor(x => x.Descricao)
                .NotEmpty()
                .MinimumLength(4)
                .WithMessage("Descrição não pode ser vazia e precisa ter comprimento maior que 3 letras");



            RuleFor(x => x.Unidade)
                .NotEmpty()
                .WithMessage("Unidade não pode ser vazia");


            RuleFor(x => x.Markup)
                .LessThan(0)
                .WithMessage("O Markup não pode ser menor que 0");
            
        
        }
    }
}
