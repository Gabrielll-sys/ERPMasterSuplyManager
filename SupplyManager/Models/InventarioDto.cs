using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    public class InventarioDto
    {
        public DateTime DataAlteracao { get; set; }

        public int? MaterialId { get; set; }

        public Material Material { get; set; }
        public string? Razao { get; set; }

        public float? Estoque { get; set; }
        public float? Movimentacao { get; set; }

        public float? SaldoFinal { get; set; }

        public string? Responsavel { get; set; }
    }
}
