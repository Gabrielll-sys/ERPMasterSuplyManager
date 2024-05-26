using FluentValidation;
using MasterErp.Domain.Models;


namespace MasterErp.Domain.Validations.UsuariosValidations
{
    public class UsuarioPostValidatior : AbstractValidator<Usuario>
    {
        public UsuarioPostValidatior()
        {

            RuleFor(x => x.Nome).NotEmpty().WithMessage("Nome não pode ser vázio");

            RuleFor(x => x.Email).EmailAddress().NotEmpty().WithMessage("Email inválido");


            RuleFor(x => x.Senha).NotEmpty().MinimumLength(6).WithMessage("A senha não pode ser vazia e precisa ter comprimento de 6 caracteres");



        }

    }
}
