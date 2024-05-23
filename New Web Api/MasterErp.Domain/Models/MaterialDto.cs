
namespace MasterErp.Domain.Models;

    public class MaterialDto
    {
        public string? CodigoInterno { get; set; }
        public string? CodigoFabricante { get; set; }
        public string? Categoria { get; set; }
        public string? Descricao { get; set; }
        public string? Marca { get; set; }
        public string? Corrente { get; set; }
        public string? Unidade { get; set; }
        public string? Tensao { get; set; }
        public string? Localizacao { get; set; }
        public DateTime? DataEntradaNF { get; set; }
        public float? PrecoCusto { get; set; }
        public float? Markup { get; set; }
    }

