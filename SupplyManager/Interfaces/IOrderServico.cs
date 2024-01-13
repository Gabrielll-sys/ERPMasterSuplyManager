namespace SupplyManager.Interfaces
{
    public interface IOrderServico
    {
        public int Id { get; set; }

        public string? Descricao { get; set; }
        //Campo para definir quando a OS for autorizada e para posteriomente impedir quaisquer modificações
        public bool IsAuthorized { get; set; }
        public string? ResponsavelAbertura { get; set; }

        public string? ResponsaveisExecucao { get; set; }

        public string? ResponsavelAutorizacao { get; set; }

        public string? Observacoes { get; set; }
        public DateTime? DataAutorizacao { get; set; }

        public DateTime? DataAbertura { get; set; }

        public DateTime? DataFechamento { get; set; }

        public string? NumeroOs { get; set; }



        public decimal? PrecoVendaTotalOs { get; set; }

        public decimal? PrecoCustoTotalOs { get; set; }



        public void AutorizarOs(string responsavelAutorizacao);
        



    }
}
