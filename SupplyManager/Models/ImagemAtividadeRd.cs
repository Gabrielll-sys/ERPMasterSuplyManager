

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models;

public class ImagemAtividadeRd
{
    [Key]
    public int? Id { get; set; }

    public string? UrlImagem { get; set; }
    
    public string? Descricao { get; set; }

    public string? DataAdicao { get; set; }
    
    public int? AtividadeRdId { get; set; }

    [ForeignKey("AtividadeRdId")]
    
    public AtividadeRd AtividadeRd { get; set; }
    
}