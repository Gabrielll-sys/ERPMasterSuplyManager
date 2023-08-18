using FluentValidation;
using SupplyManager.Models;

namespace SupplyManager.Validations.MateriaisValidations
{
    public class MateriaisPostValidator:AbstractValidator<Material>
    {

        public MateriaisPostValidator() {
            RuleFor(x => x.Descricao)
                .NotEmpty()
                .MinimumLength(4)
                .WithMessage("Descrição não pode ser vazia e precisa ter comprimento maior que 3 letras");



            RuleFor(x => x.Unidade)
                .NotEmpty()
                .WithMessage("Unidade não pode ser vazia");

            RuleFor(x => x.Codigo)
                .NotEmpty()
                .WithMessage("O código não pode ser vázio");

        
        }
    }
}
