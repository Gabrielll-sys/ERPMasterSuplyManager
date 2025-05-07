// MasterErp.Domain/Models/Forms/FormTemplateItem.cs
using MasterErp.Domain.Enums.Forms; // Criaremos este Enum abaixo

namespace MasterErp.Domain.Models.Forms
{
    public class FormTemplateItem
    {
        public int Id { get; set; }

        // Um item pertence a uma Seção OU é um Campo de Cabeçalho do Template
        public int? FormTemplateSectionId { get; set; }
        public virtual FormTemplateSection? FormTemplateSection { get; set; }

        public int? FormTemplateIdAsHeader { get; set; } // Se for um campo de cabeçalho
        public virtual FormTemplate? FormTemplateAsHeader { get; set; }

        public string Label { get; set; } // Ex: "REVISAR MEDIDAS DE LAYOUT" ou "Ordem de Serviço"
        public FormItemType ItemType { get; set; }
        public int Order { get; set; }
        public bool IsRequired { get; set; } = false;
        public string? Placeholder { get; set; }
        public string? OptionsJson { get; set; } // Para tipos com opções predefinidas (ex: dropdown)
        public string? DefaultValue { get; set; }
    }
}