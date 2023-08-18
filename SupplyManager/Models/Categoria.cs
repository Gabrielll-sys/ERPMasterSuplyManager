using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    [Table("Categorias")]

    public class Categoria
    {
        public int Id { get; set; }

        public int MaterialId { get; set; }

        [ForeignKey("MaterialId")]
        public Material Material { get; set; }
        
        //Nome da Categoria
        public string NomeCategoria { get; set; }



    }
}
