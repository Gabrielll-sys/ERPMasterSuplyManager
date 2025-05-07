// MasterErp.Domain/Models/Forms/FormTemplate.cs
using MasterErp.Domain.Models; // Para referenciar Usuario
using System;
using System.Collections.Generic;

namespace MasterErp.Domain.Models.Forms
{
    public class FormTemplate
    {
        public int Id { get; set; }
        public string Name { get; set; } // Ex: "Checklist de Montagem de Painel"
        public string? Description { get; set; }
        public int Version { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public int? CreatedByUserId { get; set; } // Nullable se puder ser criado pelo sistema
        public virtual Usuario? CreatedByUser { get; set; }

        public virtual ICollection<FormTemplateSection> Sections { get; set; } = new List<FormTemplateSection>();
        public virtual ICollection<FormTemplateItem> HeaderFields { get; set; } = new List<FormTemplateItem>(); // Campos do cabeçalho
    }
}