using System.ComponentModel.DataAnnotations;

namespace SupplyManager.Models
{
    public class Fornecedor
    {
        [Key]
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Endereco { get; set; }
        public string? Numero { get; set; }
        public string? Bairro { get; set; }
        public string? Cep { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
        public string? Telefone { get; set; }




    }
}
