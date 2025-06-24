
namespace MasterErp.Domain.Models;

    public class OrdemSeparacaoDto
    {

        public string? Descricao { get; set; }
        //Campo para definir quando a OS for autorizada e para posteriomente impedir quaisquer modificações
        public bool IsAuthorized { get; set; }

        public string? Responsavel { get; set; }
        public string? Observacoes { get; set; }
        public DateTime? DataAutorizacao { get; set; }

        public DateTime? DataAbertura { get; set; }

        public DateTime? DataFechamento { get; set; }

  

        public decimal PrecoTotalEquipamentosOs { get; set; }



    }

