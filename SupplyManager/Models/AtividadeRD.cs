using System.ComponentModel.DataAnnotations;

namespace SupplyManager.Models;

public class AtividadeRD
{
    [Key]
    public int Id { get; set; }

    public string Descricao { get; set; }

    //Concluida,Em Andamento e Não Iniciada
    public string Status  { get; set; }
    
    
    
    
}