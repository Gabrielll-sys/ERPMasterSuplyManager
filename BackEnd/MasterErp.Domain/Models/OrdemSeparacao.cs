
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MasterErp.Domain.Interfaces.Services;



namespace MasterErp.Domain.Models;

    public class OrdemSeparacao 
    {
        [Key]
        public int Id { get; set; }

        public string? Descricao { get; set; }
        //Campo para definir quando a OS for autorizada e para posteriomente impedir quaisquer modificações
        public bool IsAuthorized { get; set; }

        public string? Responsavel { get; set; }

        public bool? BaixaSolicitada { get; set; } = false;

        public List<Material> Materiais { get; set; }


        public string? Observacoes { get; set; }
        public DateTime? DataAutorizacao { get; set; }

        public DateTime? DataAbertura { get; set; }

        public DateTime? DataFechamento { get; set; }


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
        public void AutorizarOs()
        {
          
                IsAuthorized = true;
                DataAutorizacao = DateTime.UtcNow.AddHours(-3);

            
        }

    }

