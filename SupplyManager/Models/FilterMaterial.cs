namespace SupplyManager.Models
{
    public class FilterMaterial
    {

        public string? Descricao { get; set;}
        public string? Marca { get; set; }

        public float? PrecoVendaMin { get; set; }
        public float? PrecoVendaMax { get; set; }

        public float? PrecoCustoMin { get; set; }
        public float? PrecoCustoMax { get; set; }


    }
}
