using System.ComponentModel.DataAnnotations;


namespace MasterErp.Domain.Models;
public class RelatorioDiario
{
    [Key]
    public int? Id { get; set; }

    public string? ResponsavelAbertura { get; set; }
    
    public string? ResponsavelFechamento { get; set; }

    public string? Contato { get; set; }
    
    public DateTime? HorarioAbertura { get; set; }
    
    public DateTime? DataRD { get; set; }
    
    public bool? isFinished { get; set; }
    
    public DateTime? HorarioFechamento{ get; set; }


    public RelatorioDiario(string? responsavelAbertura)
    {
        ResponsavelAbertura = responsavelAbertura;
        Contato = "Sem Contato";
        HorarioAbertura = DateTime.UtcNow.AddHours(-3);;
        isFinished = false;
    }

    public void FecharRelatorio(string? responsavelFechamento)
    {
        HorarioFechamento = DateTime.UtcNow.AddHours(-3);
        isFinished = true;
    }
    
    
}