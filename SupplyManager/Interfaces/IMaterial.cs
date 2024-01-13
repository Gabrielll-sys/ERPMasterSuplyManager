namespace SupplyManager.Interfaces
{
    public interface IMaterial
    {
        public int? Id { get; set; }

        public string? CodigoInterno { get; set; }
        public string? CodigoFabricante { get; set; }

        public string? Categoria { get; set; }

        //EDITÁVEL
        public string? Descricao { get; set; }
        public string? Marca { get; set; }

        //EDITÁVEL
        public string? Corrente { get; set; }

        //MT,PC,RL,UN
        public string? Unidade { get; set; }
        //EDITÁVEL

        public string? Tensao { get; set; }

        public string? Localizacao { get; set; }


        //Data de entrada da NOTA FISCAL
        public DateTime? DataEntradaNF { get; set; }

        public float? PrecoCusto { get; set; }
        public float? Markup { get; set; }
        public float? PrecoVenda { get; set; }



        public void CalcularPrecoVenda();



    }
}
