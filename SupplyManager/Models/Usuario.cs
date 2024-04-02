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

        public string Cargo { get; set; }

        public bool isActive { get; set; }
        public DateTime? DataCadastro { get; set; }
    }


    
}
