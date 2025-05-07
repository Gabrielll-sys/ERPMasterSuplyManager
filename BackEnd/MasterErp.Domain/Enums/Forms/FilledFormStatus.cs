// MasterErp.Domain/Enums/Forms/FilledFormStatus.cs
namespace MasterErp.Domain.Enums.Forms
{
    public enum FilledFormStatus
    {
        DRAFT_ON_DEVICE,  // Salvo localmente no dispositivo, não finalizado
        PENDING_SYNC,     // Finalizado no dispositivo, aguardando envio para o servidor
        SYNCED_TO_SERVER, // Sincronizado com sucesso com o servidor
        SYNC_ERROR        // Erro durante a tentativa de sincronização
    }
}