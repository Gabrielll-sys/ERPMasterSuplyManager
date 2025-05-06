// MasterErp.Domain/Enums/Forms/FormItemType.cs
namespace MasterErp.Domain.Enums.Forms
{
    public enum FormItemType
    {
        TEXT_SHORT,       // Campo de texto curto (ex: OS, Equipamento)
        TEXT_LONG,        // Campo de texto longo (ex: Observações)
        NUMBER,           // Campo numérico
        DATETIME,         // Data e Hora
        OK_NC,            // Opções OK, Não Conforme
        OK_NC_OBS,        // OK, Não Conforme + campo de Observação textual separado
        YES_NO,           // Sim/Não
        SIGNATURE,        // Captura de assinatura (armazenará como base64 ou URL)
        SECTION_DATETIME, // Para Início/Fim de fase dentro de uma seção (apenas para renderização)
        SECTION_OBSERVATIONS // Para Observações gerais de uma seção (apenas para renderização)
        // Adicionar outros conforme a necessidade, ex: DROPDOWN, CHECKBOX_GROUP
    }
}