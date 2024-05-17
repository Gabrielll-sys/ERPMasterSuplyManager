using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FluentValidation.Results;
using SupplyManager.Interfaces;
using SupplyManager.Validations.MateriaisValidations;
using ValidationResult = FluentValidation.Results.ValidationResult;

namespace SupplyManager.Models
{

    [Table("Materiais")]
    public sealed class Material 
    {

        [Key]
        public int? Id { get; set; }

        public string? CodigoInterno { get; set; }
        public string? CodigoFabricante { get; set; }

        public string? Categoria { get; set; }

        //EDITÁVEL
        public string? Descricao { get; set; }
        public string? Marca { get; set; }

        //EDITÁVEL
        public string? Corrente { get; set; }

        //MT,PC,RL,UN
        public string? Unidade { get; set; }
        //EDITÁVEL

        public string? Tensao { get; set; }

        public string? Localizacao { get; set; }


        //Data de entrada da NOTA FISCAL
        public DateTime? DataEntradaNF { get; set; }

        public float? PrecoCusto { get; set; }
        public float? Markup { get; set; }
        public float? PrecoVenda { get; set; }


       public string? UrlImage { get; set; }


        public Material(string? codigoInterno, string? codigoFabricante, string? descricao, string? categoria, string? marca, string? corrente, string? unidade, string? tensao, string? localizacao, DateTime? dataEntradaNF, float? precoCusto, float? markup)

        {
            CodigoInterno = "-";
            CodigoFabricante = codigoFabricante.ToUpper();
            Descricao = descricao.ToUpper();
            Categoria = "-";
            Marca = marca.ToUpper();
            Corrente = String.IsNullOrEmpty(corrente) ? "-" : corrente.ToUpper();
            Unidade = unidade;
            Tensao = String.IsNullOrEmpty(tensao) ? "-" : tensao;
            Localizacao = String.IsNullOrEmpty(localizacao) ? "-" : localizacao.ToUpper();
            DataEntradaNF = dataEntradaNF;
            PrecoCusto = precoCusto;
            Markup = markup;
            PrecoVenda = precoCusto + ((markup / 100) * precoCusto);

           

        }

     
    }
}
