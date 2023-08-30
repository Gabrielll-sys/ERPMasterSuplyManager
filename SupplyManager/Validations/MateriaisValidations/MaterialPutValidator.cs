using FluentValidation;
using SupplyManager.Models;

namespace SupplyManager.Validations.MateriaisValidations
{
    public class MaterialPutValidator : AbstractValidator<Material>
    {


        public MaterialPutValidator() {

            RuleFor(x => x.Id)
                    .GreaterThan(0)
                    .NotEmpty()
                    .WithMessage("Id precisa ser maior que 0");


            RuleFor(x => x.Descricao)
                    .NotEmpty()
                    .MinimumLength(4)
                    .WithMessage("Descrição não pode ser vazia e precisa ter comprimento maior que 3 letras");


            RuleFor(x => x.Unidade)
                    .NotEmpty()
                    .WithMessage("Unidade não pode ser vazia");

            RuleFor(x => x.CodigoInterno)
                    .NotEmpty()
                    .WithMessage("O código não pode ser vázio");



        }
    }
}
