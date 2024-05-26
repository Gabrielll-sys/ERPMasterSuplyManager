using System.ComponentModel.DataAnnotations;

namespace MasterErp.Domain.Models;

    public class TarefaUsuario
    {
        [Key]
        public int Id { get; set; }
        public string Tarefa { get; set; }

        public int MyProperty { get; set; }
    }

