using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MasterErp.Domain.Models;

// Entidade para armazenar imagens anexadas ao checklist de inspecao.
[Table("ChecklistsInspecaoImagens")]
public class ChecklistInspecaoImagem
{
    [Key]
    public int Id { get; set; }

    // FK do checklist ao qual a imagem pertence.
    public int ChecklistInspecaoId { get; set; }

    // URL publica para exibicao.
    public string ImageUrl { get; set; } = string.Empty;

    // Chave da imagem no R2 (usada para excluir).
    public string ImageKey { get; set; } = string.Empty;

    // Data de criacao do registro.
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow.AddHours(-3);

    // Navegacao do checklist.
    public ChecklistInspecao? ChecklistInspecao { get; set; }
}
