// MasterErp.Services/Interfaces/Forms/IFormTemplateService.cs
using MasterErp.Services.DTOs.Forms;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MasterErp.Services.Interfaces.Forms
{
    public interface IFormTemplateService
    { /// <summary>
      /// Obtém uma lista de todos os modelos de formulário ativos (a versão mais recente de cada).
      /// </summary>
        Task<IEnumerable<FormTemplateBasicDto>> GetActiveTemplatesAsync();

        /// <summary>
        /// Obtém os detalhes de uma versão específica de um modelo de formulário.
        /// Se a versão não for especificada, obtém a mais recente ativa.
        /// </summary>
        Task<FormTemplateDetailDto?> GetTemplateDetailAsync(int templateId, int? version = null);

        /// <summary>
        /// Cria um novo modelo de formulário.
        /// </summary>
        Task<FormTemplateDetailDto> CreateTemplateAsync(FormTemplateCreateDto dto, int createdByUserId);

        /// <summary>
        /// Atualiza um modelo de formulário existente.
        /// Geralmente, isso resultará na criação de uma nova versão do modelo.
        /// </summary>
        Task<FormTemplateDetailDto?> UpdateTemplateAsync(int templateId, FormTemplateUpdateDto dto, int updatedByUserId);

        /// <summary>
        /// Desativa um modelo de formulário (soft delete).
        /// </summary>
        /// <returns>True se bem-sucedido, False se o template não for encontrado.</returns>
        Task<bool> DeleteTemplateAsync(int templateId);
    }
}