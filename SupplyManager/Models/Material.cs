using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    [Table("Materiais")]
    public class Material
    {

        [Key]
        public int? Id { get; set; }

        public string? Codigo { get; set; }

        //EDITÁVEL
        public string? Descricao { get; set; }
        public string? Marca { get; set; }

        //EDITÁVEL
        public string? Corrente { get; set; }

        //MT,PC,RL,UN
        public string? Unidade { get; set; }
        //EDITÁVEL

        public string? Tensao { get; set; }

       
        //Data de entrada da NOTA FISCAL
        public DateTime? DataEntradaNF { get; set; }

    

    
        



    }
 
}
