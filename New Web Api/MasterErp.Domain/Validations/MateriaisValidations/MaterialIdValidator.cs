using FluentValidation;
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Validations.MateriaisValidations
{
    public class MaterialIdValidator : AbstractValidator<int?>
    {

        public MaterialIdValidator()
        {

            RuleFor(x => x)
                .NotEqual(0)
                .WithName("Id")
                .WithMessage("Id não pode ser vazio e precisa ser maior que 0");


        }
    }
}
