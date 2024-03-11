using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    public class ItemNotaFiscal
    {
        [Key]
        public int Id { get; set; }
        public decimal? ValorUnitario { get; set; }
        public decimal? AliquotaICMS { get; set; }
        public decimal? AliquotaIPI { get; set; }
        public decimal? Quantidade { get; set; }
        public int MaterialId { get; set; }

        [ForeignKey("MaterialId")]
        public Material? Material { get; set; }

        public int NotaFiscalId { get; set; }

        [ForeignKey("NotaFiscalId")]

        public NotaFiscal? NotaFiscal { get; set; }



    }
}
