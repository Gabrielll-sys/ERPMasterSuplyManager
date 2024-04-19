using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models;

public class AtividadeRd
{
    [Key]
    public int? Id { get; set; }

    public string? Descricao { get; set; }

    //Concluida,Em Andamento e Não Iniciada
    public string? Status  { get; set; }
    
    public string? Observacoes { get; set; }

    [ForeignKey("RelatorioRdId")]
    
    public RelatorioDiario RelatorioDiario { get; set; }
    
    public int? RelatorioRdId { get; set; }
    
}