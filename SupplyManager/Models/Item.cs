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
       public  Material? Material { get; set; }


       public int OrdemServicoId { get; set; }

        [ForeignKey("OrdemServicoId")]

        public OrdemServico? OrdemServico { get; set; }

        //Responsável pela criação do item,no caso ficara fácil rastrear quem adicionou o material na ordem de serviço
        public string ResponsavelAdicao { get; set; }
        public string? ResponsavelMudanca { get; set; }

        public DateTime DataAdicaoItem { get; set; }
        public DateTime? DataAlteracaoItem { get; set; }
        public float? Quantidade { get; set; }

       public Item(int materialId,int ordemServicoId,float? quantidade,string responsavelAdicao)
        {
            MaterialId = materialId;
            OrdemServicoId = ordemServicoId;
            Quantidade = quantidade;
            ResponsavelAdicao = responsavelAdicao;
            DataAdicaoItem = DateTime.Now;
            DataAlteracaoItem = null;

        }


    }
}
