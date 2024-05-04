using System.ComponentModel.DataAnnotations;

namespace SupplyManager.Models;

public class RelatorioDiario
{
    [Key]
    public int? Id { get; set; }

    public string? Responsavel { get; set; }

    public string? Contato { get; set; }
    
    public DateTime? HorarioAbertura { get; set; }
    
    public DateTime? DataRD { get; set; }
    
    public bool? isFinished { get; set; }


    public RelatorioDiario(string responsavel)
    {
        Responsavel = responsavel;
        Contato = "Sem Contato";
        HorarioAbertura = DateTime.UtcNow.AddHours(-3);;
        isFinished = false;
    }
}