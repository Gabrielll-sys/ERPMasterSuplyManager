using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MasterErp.Domain.Models;

[Table("Aprs")]
public class Apr
{
    [Key]
    public int Id { get; set; }

    public string? Titulo { get; set; }

    public DateTime Data { get; set; }

    public string ConteudoJson { get; set; } = "{}";

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow.AddHours(-3);

    public DateTime? AtualizadoEm { get; set; }
}
