using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    public class ItemOrcamento
    {
        public int Id { get; set; }

        public decimal QuantidadeMaterial { get; set; }

        public int MaterialId { get; set; }

        [ForeignKey("MaterialId")]
        public Material? Material { get; set; }
        public int OrcamentoId { get; set; }

        [ForeignKey("OrcamentoId")]
        public Orcamento? Orcamento { get; set; }
    }


}

