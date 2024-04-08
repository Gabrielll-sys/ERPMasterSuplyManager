using System.ComponentModel.DataAnnotations.Schema;

namespace SupplyManager.Models
{
    public class Orcamento
    {
        //O ORÇAMENTO NÃO É UMA VENDA,MAS CASO OS MATERIAS SEJAM DE FATOS VENDIDOS AI SIM SE TORNARÁ UMA VENDA
        public int Id { get; set; }
        
        public string? ResponsavelOrcamento { get; set; }

        public string? ResponsavelVenda { get; set; }
        public DateTime? DataOrcamento { get; set; }
        // Exemplo ,Orçamento Fornos Açorforja
        public string? NomeOrcamento { get; set; }
        public string? Observacoes { get; set; }

        public decimal? Desconto { get; set; }

        public decimal? Acrescimo { get; set; }

        public decimal? PrecoVendaTotal { get; set; }
        public decimal? PrecoVendaComDesconto { get; set; }

        public DateTime? DataVenda { get; set; }
        public bool? IsPayed { get; set; }

        public string? NomeCliente { get; set; }
        //Caso seja de  uma empresa
        public string? Empresa { get; set; }

        public string? EmailCliente { get; set; }

        public string? Telefone { get; set; }
        public string? Endereco { get; set; }

        public string? CpfOrCnpj { get; set; }

        public string? TipoPagamento { get; set; }

       
    }
}

