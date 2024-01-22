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

        public string? ResponsavelAbertura { get; set; }
        //Funcionário que executou o serviço/OS
        public string? ResponsaveisExecucao { get; set; }
        public string? ResponsavelAutorizacao { get; set; }

        public string? Observacoes { get; set; }
        public DateTime? DataAutorizacao { get; set; }

        public DateTime? DataAbertura { get; set; }

        public DateTime? DataFechamento { get; set; }

        //Caso seja OS da brastorno,ira exigirr que o usuário que está criando digite o numero,caso seja master elétrica,irá pegar pelo id da ordem de serviço criada
        public string? NumeroOs { get; set; }


        public decimal? PrecoVendaTotalOs{ get; set; }

        public decimal? PrecoCustoTotalOs { get; set; }



        /*   public OrdemServico(string? descricao,string? responsavelAbertura, string? responsavelExecucao,string? numeroOs)
           {
               Descricao =  descricao;
               ResponsavelAbertura = responsavelAbertura;
               ResponsaveisExecucao.Add(responsavelExecucao);
               IsAuthorized = false;
               DataAbertura = DateTime.Now;
               NumeroOs = numeroOs;
           }
   */
        public void AutorizarOs(string responsavelAutorizacao)
        {
          
                ResponsavelAutorizacao = responsavelAutorizacao;
                IsAuthorized = true;
                DataAutorizacao = DateTime.UtcNow.AddYears(-3);

            
        }

    }
}
