
using System.ComponentModel.DataAnnotations.Schema;

namespace MasterErp.Domain.Models
{
    [Table("Inventarios")]
    public class Inventario 
    {
        public int Id { get; set; }
        public DateTime DataAlteracao { get; set; }

        public int? MaterialId { get; set; }

        [ForeignKey("MaterialId")]
        public Material Material { get; set; }
        public string? Razao { get; set; }

        public float? Estoque { get; set; }
        public float? Movimentacao { get; set; }

        public float? SaldoFinal { get; set; }

        public string? Responsavel { get;set; }




        public Inventario()
        {

        }
        public Inventario(string? razao,float? estoque,float? movimentacao,float? saldoFinal,string? responsavel,int? materialId) { 

          
            Razao = razao;
            Estoque = estoque;
            Movimentacao = movimentacao;
            SaldoFinal = saldoFinal;
            Responsavel = responsavel;
            MaterialId = materialId;
            DataAlteracao = DateTime.UtcNow.AddHours(-3);
            
        }

        public float? EstoqueMovimentacao(float? saldoFinal)
        {

            if (saldoFinal > Estoque)
            {
                Movimentacao = saldoFinal - Estoque;
                SaldoFinal = saldoFinal;

                return SaldoFinal;
            }
            else if (saldoFinal < Estoque)
            {
                Movimentacao = saldoFinal - Estoque;
                SaldoFinal = saldoFinal;

                return SaldoFinal;

            }
            else if (Estoque == 0 && saldoFinal > 0)
            {
                Movimentacao = saldoFinal - Estoque;
                SaldoFinal = saldoFinal;

                return saldoFinal;
            }
            else
            {
                return null;
            }


        }

        public void MovimentacaoOrdemSeparacao(float? quantidade,string razao) 
        
        {
            Razao = razao;
            SaldoFinal -= quantidade;
            Movimentacao = - quantidade;
        }
        public void MovimentacaoOrcamento(float? quantidade, string razao)

        {
            Razao = razao;
            SaldoFinal -= quantidade;
            Movimentacao = -quantidade;
        }


    }
}
