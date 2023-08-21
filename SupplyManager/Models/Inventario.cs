using SupplyManager.Interfaces;

namespace SupplyManager.Models
{

    public class Inventario : IInvetario
    {
        public int Id { get; set; }

        public string? Descricao { get; set; }
        public string? Codigo { get; set; }

        public string? Razao { get; set; }

        public float? Estoque { get; set; }
        public float? Movimentacao { get; set; }

        public float? SaldoFinal { get; set; }


        public Inventario(string? descricao,string? codigo,string? razao,float? estoque,float? movimentacao,float? saldoFinal) { 
            Descricao = descricao;
            Codigo = codigo;
            Razao = razao;
            Estoque = estoque;
            Movimentacao = movimentacao;
            SaldoFinal = saldoFinal;
        
        }
        
           public string EstoqueMovimentacao(float? movimento)
        {

            if (movimento > Estoque)
            {
                Movimentacao= movimento-Estoque;
          
                return "Estoque removido com sucesso";
            } 
            else if (movimento < Estoque)
            {
                Movimentacao = Estoque - movimento;
                return "Estoque removido com sucesso";

            }
            else
            {
                return "O valor de movimento é igual ao estoque anterior";
            }


        }

        
    }
}
