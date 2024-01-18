namespace SupplyManager.Interfaces
{
    public interface INotaFiscal
    {
        public int Id { get; set; }
        public string NumeroNF { get; set; }
    
        public decimal Frete { get; set; }

        public decimal BaseCalculoICMS {get;set;}

        public decimal ValorICMS { get; set; }
        public string CFOP { get; set; }
        public DateTime DataEmissaoNF { get; set; }

    }
}
