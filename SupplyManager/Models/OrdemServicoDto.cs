namespace SupplyManager.Models
{
    public class OrdemServicoDto
    {

        public string? Descricao { get; set; }
        //Campo para definir quando a OS for autorizada e para posteriomente impedir quaisquer modificações
        public bool IsAuthorized { get; set; }

        public string? ResponsavelAbertura { get; set; }
        //Funcionário que executou o serviço/OS
        public string? ResponsavelExecucao { get; set; }
        public string? ResponsavelAutorizacao { get; set; }

        public string? Observacao { get; set; }
        public DateTime? DataAutorizacao { get; set; }

        public DateTime? DataAbertura { get; set; }

        public DateTime? DataFechamento { get; set; }

        public string? NumeroOs { get; set; }


        public decimal PrecoTotalEquipamentosOs { get; set; }



    }
}
