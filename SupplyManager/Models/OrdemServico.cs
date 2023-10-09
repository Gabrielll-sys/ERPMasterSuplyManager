using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SupplyManager.Interfaces;
namespace SupplyManager.Models
{
    public class OrdemServico
    {
        [Key]
        public int Id { get; set; }

        public string? Descricao { get; set; }
        //Campo para definir quando a OS for autorizada e para posteriomente impedir quaisquer modificações
        public bool IsAutorizhed { get; set; }

        public string? Responsavel { get; set; }

        public DateTime? DataAutorizacao { get; set; }

        [ForeignKey("MaterialId")]
        public Material Material { get; set; }
        public OrdemServico(string descricao, string responsavel)
        {
            Descricao = descricao;
            Responsavel = responsavel;
            IsAutorizhed = false;
        }

        public void AutorizarOs()
        {

            if (!IsAutorizhed)
            {

                IsAutorizhed = true;
                DataAutorizacao = DateTime.Now;

            }


        }

    }
}
