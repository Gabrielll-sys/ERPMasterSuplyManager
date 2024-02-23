using SupplyManager.Interfaces;

namespace SupplyManager.Models
{
    public class Venda:IVenda
    {
        
        public int Id { get; set; }

        public DateTime DataVenda { get; set; }

        public TipoPagamento Pagamento { get; set; }

        public decimal Desconto { get; set; }

        public decimal Acrescimo { get; set; }

        public decimal PrecoTotal { get; set; }


        public bool IsPayed { get; set; }

    }




    public enum TipoPagamento
    {
        Boleto,
        PIX,
        Cartao_de_Credito
    }
}
