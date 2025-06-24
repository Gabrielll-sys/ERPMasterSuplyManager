// MasterErp.Domain/Models/Forms/FormTemplateSection.cs
using System.Collections.Generic;

namespace MasterErp.Domain.Models.Forms
{
    public class FormTemplateSection
    {
        public int Id { get; set; }

        public int FormTemplateId { get; set; }
        public virtual FormTemplate FormTemplate { get; set; }

        public string Name { get; set; } // Ex: "PREPARAÇÃO"
        public int Order { get; set; } // Ordem de exibição

        public virtual ICollection<FormTemplateItem> Items { get; set; } = new List<FormTemplateItem>();
    }
}