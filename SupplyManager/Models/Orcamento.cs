using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    public class Orcamento
    {
        //O ORÇAMENTO NÃO É UMA VENDA,MAS CASO OS MATERIAS SEJAM DE FATOS VENDIDOS AI SIM SE TORNARÁ UMA VENDA
        public int Id { get; set; }

        public string? ReponsavelOrcamento { get; set; }

        public DateTime? DataOrcamento { get; set; }
        public string? Observacoes { get; set; }

        public decimal? Desconto { get; set; }

        public decimal? Acrescimo { get; set; }

        public decimal? PrecoTotal { get; set; }


        public DateTime? DataVenda { get; set; }
        public bool? IsPayed { get; set; }


        public enum TipoPagamento
        {
            Boleto,
            PIX,
            Cartao
        }
    }

}

