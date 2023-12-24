using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SupplyManager.Interfaces;
using SixLabors.ImageSharp.Processing.Processors.Transforms;

namespace SupplyManager.Models
{
    public class OrdemServico : IOrderServico
    {
        [Key]
        public int Id { get; set; }

        public string? Descricao { get; set; }
        //Campo para definir quando a OS for autorizada e para posteriomente impedir quaisquer modificações
        public bool IsAuthorized { get; set; }

        //Funcionário que executou o serviço/OS
        public string? ResponsavelAbertura { get; set; }
        public string? ResponsavelExecucao { get; set; }
        public string? ResponsavelAutorizacao { get; set; }

        public string? Observacao { get; set; }
        public DateTime? DataAutorizacao { get; set; }

        public DateTime? DataAbertura { get; set; }

        public DateTime? DataFechamento { get; set; }

        public string? OsBrastorno { get; set; }


        public decimal PrecoTotalEquipamentosOs { get; set; }




        public OrdemServico(string? descricao,string? responsavelAbertura, string? responsavelExecucao,string osBrastorno)
        {
            Descricao =  descricao;
            ResponsavelAbertura = responsavelAbertura;
            ResponsavelExecucao = responsavelExecucao;
            IsAuthorized = false;
            DataAbertura = DateTime.Now;
            OsBrastorno = osBrastorno;
        }

        public void AutorizarOs(string responsavelAutorizacao)
        {


            if (!IsAuthorized)
            {
                ResponsavelAutorizacao = responsavelAutorizacao;
                IsAuthorized = true;
                DataAutorizacao = DateTime.Now;

            }


        }

    }
}
