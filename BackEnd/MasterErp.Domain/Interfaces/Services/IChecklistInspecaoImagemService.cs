using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;

// Contrato da camada de servico para imagens do checklist.
public interface IChecklistInspecaoImagemService
{
    // Lista imagens do checklist.
    Task<List<ChecklistInspecaoImagem>> GetByChecklistIdAsync(int checklistId);
    // Busca imagem por id.
    Task<ChecklistInspecaoImagem?> GetByIdAsync(int id);
    // Cria uma imagem vinculada ao checklist.
    Task<ChecklistInspecaoImagem> CreateAsync(int checklistId, ChecklistInspecaoImagem model);
    // Remove imagem do banco.
    Task DeleteAsync(int id);
}
