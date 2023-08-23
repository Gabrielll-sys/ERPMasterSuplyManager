using SupplyManager.Interfaces;

namespace SupplyManager.Models
{

    public class Inventario : IInvetario
    {
        public int Id { get; set; }
        public DateTime DataAlteracao { get; set; }

        public string? Descricao { get; set; }
        public string? Codigo { get; set; }

        public string? Razao { get; set; }

        public float? Estoque { get; set; }
        public float? Movimentacao { get; set; }

        public float? SaldoFinal { get; set; }

        public string? Responsavel { get;set; }


        public Inventario(string? descricao,string? codigo,string? razao,float? estoque,float? movimentacao,float? saldoFinal,string? responsavel) { 
            DataAlteracao= DateTime.Now;
            Descricao = descricao;
            Codigo = codigo;
            Razao = razao;
            Estoque = estoque;
            Movimentacao = movimentacao;
            SaldoFinal = saldoFinal;
            Responsavel = responsavel;
        
        }
        
          

        
    }
}
