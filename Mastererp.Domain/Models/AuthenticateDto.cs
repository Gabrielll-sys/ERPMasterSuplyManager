using System.ComponentModel.DataAnnotations;


namespace MasterErp.Domain.Models;

    public class AuthenticateDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string? Senha { get; set; }
        public List<object> PerfilAutorizado { get; set; }


    }

