using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    public class Cliente
    {
        public int Id { get; set; }

        public string? Nome { get; set; }
     
        public string? Email { get; set; }

        public string? Telefone { get; set; }
        
        public string? Endereço { get; set; }

        public string? CPFOrCNPJ { get; set; }


        public int OrcamentoId { get; set; }


        [ForeignKey("OrcamentoId")]
        public Orcamento Orcamento { get; set; }

        public int MyProperty { get; set; }

    }
}
