using System.ComponentModel.DataAnnotations;

namespace SupplyManager.Models
{
    public class LogAcoesUsuario
    {
        [Key]
        public int? Id { get; set; }
        public string? Acao { get; set; }
        public DateTime? DataAcao { get; set; }
        public string? Responsavel { get; set; }


        public LogAcoesUsuario(string? acao,string? responsavel)
        {
            Acao = acao;
            DataAcao = DateTime.UtcNow.AddHours(-3);
            Responsavel = responsavel;
        }

        public LogAcoesUsuario()
        {
            
        }
    }
}
