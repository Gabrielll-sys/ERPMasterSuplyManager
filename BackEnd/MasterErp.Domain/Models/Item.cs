// 🎓 ARQUITETURA EXPLICADA:
// Alteramos o modelo Item para suportar uma relação opcional com Material.
// Isso nos permite usar a mesma tabela para itens cadastrados e não cadastrados.

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MasterErp.Domain.Models
{
    public class Item
    {

        [Key]
        public int Id { get; set; }


        //    - Se MaterialId tiver um valor, é um item cadastrado.
        //    - Se MaterialId for NULL, é um item não cadastrado.
        public int? MaterialId { get; set; } // ANTES: int MaterialId

        [ForeignKey("MaterialId")]
        public Material? Material { get; set; }

        public int OrdemSeparacaoId { get; set; }

        [ForeignKey("OrdemSeparacaoId")]
        public OrdemSeparacao? OrdemSeparacao { get; set; }

        public string? DescricaoNaoCadastrado { get; set; } // NOVO CAMPO

        public string Responsavel { get; set; }

        public DateTime DataAdicaoItem { get; set; }
        public DateTime? DataAlteracaoItem { get; set; }
        public float? Quantidade { get; set; }
        
        public string? Unidade { get; set; }


        // O construtor permanece o mesmo, pois a lógica de criação será no serviço/controller
        public Item(int? materialId, int ordemSeparacaoId, float? quantidade, string responsavel, string? descricaoNaoCadastrado,string? unidade)
        {
            MaterialId = materialId;
            OrdemSeparacaoId = ordemSeparacaoId;
            Quantidade = quantidade;
            Responsavel = responsavel;
            DataAdicaoItem = DateTime.UtcNow.AddHours(-3);
            DataAlteracaoItem = null;
            DescricaoNaoCadastrado = descricaoNaoCadastrado;
            Unidade = unidade;
        }

     
    }
}