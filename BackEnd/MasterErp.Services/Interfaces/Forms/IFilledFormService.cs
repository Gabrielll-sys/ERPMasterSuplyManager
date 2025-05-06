// MasterErp.Services/Interfaces/Forms/IFilledFormService.cs
using MasterErp.Services.DTOs.Forms;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MasterErp.Services.Interfaces.Forms
{
    public interface IFilledFormService
    { /// <summary>
      /// Processa um lote de formulários preenchidos enviados pelo dispositivo móvel para sincronização.
      /// </summary>
        Task<BatchSyncResponseDto> ProcessSyncBatchAsync(List<FilledFormSyncDto> formsToSync, int filledByUserId);

        /// <summary>
        /// Obtém uma lista paginada e filtrada de instâncias de formulários preenchidos.
        /// </summary>
        Task<IEnumerable<FilledFormInstanceListItemDto>> GetFilledFormsAsync(
            int? templateId,
            int? filledByUserIdFilter, // Filtro para buscar por quem preencheu
            DateTime? startDate,
            DateTime? endDate,
            string? status, // String para o status, será convertido para enum
            int page,
            int pageSize,
            int requestingUserId, // ID do usuário que está fazendo a requisição
            bool isUserAdminOrManager // Flag para indicar se o usuário tem permissões elevadas
        );

        /// <summary>
        /// Obtém os detalhes de uma instância específica de formulário preenchido.
        /// Verifica as permissões do usuário solicitante.
        /// </summary>
        Task<FilledFormInstanceDetailDto?> GetFilledFormDetailAsync(
            Guid instanceId,
            int requestingUserId,
            bool isUserAdminOrManager
        );
    }
}