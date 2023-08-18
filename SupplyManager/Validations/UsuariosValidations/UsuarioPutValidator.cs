using FluentValidation;
using SupplyManager.Models;

namespace SupplyManager.Validations.UsuariosValidations
{
    public class UsuarioPutValidator: AbstractValidator<Usuario>
    {
        public UsuarioPutValidator() {



            RuleFor(x => x.Id).NotEmpty().GreaterThan(0).WithMessage("Id não pode ser vazio e tem que ser maior que 0");

            RuleFor(x => x.Nome).NotEmpty().WithMessage("Nome não pode ser vazio");

            RuleFor(x => x.Email).EmailAddress().WithMessage("Email Inválido");

            RuleFor(x => x.Senha).NotEmpty().WithMessage("Senha não pode ser vazia");


        
        
        
        }

    }
}
