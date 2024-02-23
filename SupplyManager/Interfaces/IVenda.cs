namespace SupplyManager.Interfaces
{
    public interface IVenda
    {

        public int Id { get; set; }

        public DateTime DataVenda { get; set; }

        public decimal Desconto { get; set; }

        public decimal Acrescimo { get; set; }

        public decimal PrecoTotal { get; set; }


        public bool IsPayed { get; set; }

    }




    
}

