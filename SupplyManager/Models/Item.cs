using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    //Classe que pega a referência entre material e OS,aonde uma OS pode ter um ou vários materiáis e 1 material pode pertencer a 1 ou várias OS
    public class Item
    {
        [Key]
        public int Id { get; set; }

        public int MaterialId { get; set; }


        [ForeignKey("MaterialId")]
       public  Material Material { get; set; }


       public int OrdemServicoId { get; set; }

        [ForeignKey("OrdemServicoId")]

        public OrdemServico OrdemServico { get; set; }


        


    }
}
