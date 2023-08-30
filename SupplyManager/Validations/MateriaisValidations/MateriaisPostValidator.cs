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

            RuleFor(x => x.CodigoInterno)
                .NotEmpty()
                .MinimumLength(4)
                .WithMessage("O código não pode ser vázio e precisa ter comprimento maior que 3 caracteres");

        
        }
    }
}
