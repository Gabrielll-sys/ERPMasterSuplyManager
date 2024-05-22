using FluentValidation;

namespace MasterErp.Domain.Validations.UsuariosValidations
{
    public class UsuarioIdValidator : AbstractValidator<int?>
    {
        public UsuarioIdValidator()
        {

            RuleFor(x => x)
                .NotEqual(0)
                .WithName("Id")
                .WithMessage("O Id não pode ser vazio e precisa ser  mair que 0");


        }

    }
}
