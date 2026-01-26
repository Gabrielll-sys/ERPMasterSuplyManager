using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MasterErp.Domain.Models;

// Entidade para armazenar checklist digital em formato JSON.
[Table("ChecklistsInspecao")]
public class ChecklistInspecao
{
    [Key]
    public int Id { get; set; }

    // JSON completo do checklist (source of truth).
    public string ConteudoJson { get; set; } = "{}";

    // Datas de controle do registro.
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow.AddHours(-3);

    public DateTime? AtualizadoEm { get; set; }
}
