using FluentValidation;
using SupplyManager.Models;

namespace SupplyManager.Validations.UsuariosValidations
{
    public class UsuarioPostValidatior : AbstractValidator<Usuario>
    {
        public UsuarioPostValidatior() {

            RuleFor(x => x.Nome).NotEmpty().WithMessage("Nome não pode ser vázio");

            RuleFor(x => x.Email).EmailAddress().NotEmpty().WithMessage("Email inválido");


            RuleFor(x => x.Senha).NotEmpty().MinimumLength(8).WithMessage("A senha não pode ser vazia e precisa ter comprimento de 8 caracteres");
        
        
        
        }

    }
}
