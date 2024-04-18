

using System.ComponentModel.DataAnnotations;

namespace SupplyManager.Models;

public class ImagemAtividadeRd
{
    [Key]
    public int Id { get; set; }

    public string UrlImagem { get; set; }
    
    public string Descricao { get; set; }

    public string DataAdicao { get; set; }

    
    
}