using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MasterErp.Domain.Models;

    public class TarefaUsuario
    {
        [Key]
        public int? Id { get; set; }
        public string? NomeTarefa { get; set; }
        public string? Prioridade { get; set; }

        public bool? Status { get; set; }
        public int? UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        public Usuario Usuario { get; set; }

}
