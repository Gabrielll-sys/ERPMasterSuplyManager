using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    public class ItemVenda
    {
        public int Id { get; set; }

        public decimal QuantidadeMaterial { get; set; }

        public int MaterialId { get; set; }

        [ForeignKey("MaterialId")]
        public Material? Material { get; set; }
        public int VendaId { get; set; }

        [ForeignKey("VendaId")]
        public Venda? Venda { get; set; }
    }
}
