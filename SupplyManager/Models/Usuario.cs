using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    [Table("Usuários")]

    public class Usuario
    {
        public int Id { get; set; }

        public string Nome { get; set; }

        public string Email { get; set; }

        public string Senha { get; set; }


        public enum Perfil
        {
            [Description("Administrador")]
            Administrador,
            [Description("Auditor Fiscal")]

            AuditorFiscal,
            
        }



    }
}
