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
        public bool IsAuthorized { get; set; }

        public string? Responsavel { get; set; }

        public DateTime? DataAutorizacao { get; set; }

     
        public int? NumeroOs { get; set; }

        public OrdemServico(string? descricao, string? responsavel, int? numeroOs)
        {
            Descricao =  descricao;
            Responsavel = responsavel;
            IsAuthorized = false;
            NumeroOs = numeroOs;
        }

        public void AutorizarOs()
        {

            if (!IsAuthorized)
            {

                IsAuthorized = true;
                DataAutorizacao = DateTime.Now;

            }


        }

    }
}
