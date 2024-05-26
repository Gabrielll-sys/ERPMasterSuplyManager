using System.ComponentModel.DataAnnotations.Schema;

namespace MasterErp.Domain.Models
{
    public class ItemOrcamento
    {
        public int Id { get; set; }

        public decimal QuantidadeMaterial { get; set; }
        public DateTime DataAdicaoItem { get; set; }
        // Campo para caso o preço de venda do produto não seja interessante, a pessoa mude para um novo preço
        public decimal? PrecoItemOrcamento { get; set; }

        public int MaterialId { get; set; }

        [ForeignKey("MaterialId")]
        public Material? Material { get; set; }
        public int OrcamentoId { get; set; }

        [ForeignKey("OrcamentoId")]
        public Orcamento? Orcamento { get; set; }
    }


}

