// 🎓 ARQUITETURA EXPLICADA:
// O DTO (Data Transfer Object) é atualizado para espelhar as mudanças do modelo.
// Ele é a "forma" como os dados chegam do frontend para o backend.

using System.ComponentModel.DataAnnotations.Schema;

namespace MasterErp.Domain.Models
{
    public class ItemDto
    {
  
        public int? MaterialId { get; set; }

        public int OrdemSeparacaoId { get; set; }

        public string? DescricaoNaoCadastrado { get; set; }

        public string Responsavel { get; set; }

        public float? Quantidade { get; set; }
        
        public string? Unidade { get; set; }
    }
}