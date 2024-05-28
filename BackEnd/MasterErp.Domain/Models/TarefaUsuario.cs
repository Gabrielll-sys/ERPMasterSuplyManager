using System.ComponentModel.DataAnnotations;

namespace MasterErp.Domain.Models;

    public class TarefaUsuario
    {
        [Key]
        public int Id { get; set; }
        public string NomeTarefa { get; set; }
        public string Prioridade { get; set; }

       public bool Status { get; set; }
    }
