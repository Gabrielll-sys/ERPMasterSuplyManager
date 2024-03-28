using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    [Table("Usuários")]

    public class Usuario
    {
        [Key]
        public int? Id { get; set; }

        public string? Nome { get; set; }

        public string? Email { get; set; }

        public string? Senha { get; set; }

        public Perfil? PerfilUsuario { get; set; }

        public DateTime? DataCadastro { get; set; }
    }
    public enum Perfil
        {
            [Description("Diretor")]
            Diretor,
            [Description("Administrador")]
            Administrador,
            [Description("Administrador")]
            Funcionario,
            [Description("Personalizado")]
            Personalizado,
            [Description("Cliente")]
            Cliente
        }



    
}
