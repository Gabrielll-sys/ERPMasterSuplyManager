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

        public string? Codigo { get; set; }

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


        public DateTime DataAlteracao { get; set; }
        public string? Razao { get; set; }

        public float? Estoque { get; set; }
        public float? Movimentacao { get; set; }

        public float? SaldoFinal { get; set; }

        public string? Responsavel { get; set; }

        public Material(string? codigo, string? descricao, string? marca, string? corrente, string? unidade, string? tensao, DateTime? dataEntradaNF, DateTime dataAlteracao, string? razao, float? estoque, float? movimentacao, float? saldoFinal, string? responsavel)
        {
            Codigo = codigo;
            Descricao = descricao;
            Marca = marca;
            Corrente = corrente;
            Unidade = unidade;
            Tensao = tensao;
            DataEntradaNF = dataEntradaNF;
            Razao = razao;
            Estoque = estoque;
            Movimentacao = movimentacao;
            SaldoFinal = saldoFinal;
            Responsavel = responsavel;
        }



        public string EstoqueMovimentacao(float? saldoFinal)
        {

            if (saldoFinal > Estoque)
            {
                Movimentacao = saldoFinal - Estoque;
                SaldoFinal = saldoFinal;

                return "Estoque adicionado com sucesso";
            }
            else if (saldoFinal < Estoque)
            {
                Movimentacao = saldoFinal - Estoque;
                SaldoFinal = saldoFinal;

                return "Estoque removido com sucesso";

            }
            else
            {
                return "O valor de movimento é igual ao estoque anterior";
            }


        }

    }

}
