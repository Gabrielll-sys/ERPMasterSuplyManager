using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MasterErp.Domain.Models;
namespace MasterErp.Domain.Models;

public class AtividadeRd
{
    [Key]
    public int? Id { get; set; }

    public int? NumeroAtividade { get; set; }
    
    public string? Descricao { get; set; }

    //Concluida,Em Andamento e Não Iniciada
    public string? Status  { get; set; }
    
    public string? Observacoes { get; set; }
    
    public int? RelatorioRdId { get; set; }

    public DateTime DataAdicao { get; set; }


    [ForeignKey("RelatorioRdId")]
    
    public RelatorioDiario RelatorioDiario { get; set; }
    
    
    
    
}
