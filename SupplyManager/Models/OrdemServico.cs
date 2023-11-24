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

        public string? ResponsavelAutorizacao { get; set; }

        public DateTime? DataAutorizacao { get; set; }

        public DateTime? DataAbertura { get; set; }

        public DateTime? DataFechamento { get; set; }

        public string? OsBrastorno { get; set; }

        public string Usuario { get; set; }




        public OrdemServico(string? descricao, string? responsavel, int? numeroOs)
        {
            Descricao =  descricao;
            ResponsavelAutorizacao = responsavel;
            IsAuthorized = false;
            DataAbertura = DateTime.Now;
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
