using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SupplyManager.Interfaces;
namespace SupplyManager.Models
{
    [Table("Materiais")]
    public class Material:IMaterial
    {

        [Key]
        public int? Id { get; set; }

        public string? CodigoInterno { get; set; }
        public string? CodigoFabricante { get; set; }

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


        public DateTime? DataAlteracao { get; set; }
        public string? Razao { get; set; }

        public float? Estoque { get; set; }
        public float? Movimentacao { get; set; }

        public float? SaldoFinal { get; set; }

        public string? Responsavel { get; set; }

        public Material(string? codigoInterno, string? codigoFabricante, string? descricao, string? marca, string? corrente, string? unidade, string? tensao, DateTime? dataEntradaNF,  string? razao, float? estoque, float? movimentacao, float? saldoFinal, string? responsavel)
        {
            CodigoInterno = codigoInterno;
            CodigoFabricante= codigoFabricante;
            Descricao = descricao;
            Marca = marca;
            Corrente = corrente;
            Unidade = unidade;
            Tensao = tensao;
            DataEntradaNF = dataEntradaNF;
            Razao = razao;
            Estoque =  estoque;
            Movimentacao = movimentacao;
            SaldoFinal = saldoFinal;
            Responsavel = responsavel;

            if (estoque != null)
            {
                DataAlteracao= DateTime.Now;
            }
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
            else if(Estoque==0 && saldoFinal>0)
            {
                Movimentacao = saldoFinal-Estoque;
                SaldoFinal = saldoFinal;

                return saldoFinal;
            }
            else
            {
                return null;
            }


        }

    }

}
