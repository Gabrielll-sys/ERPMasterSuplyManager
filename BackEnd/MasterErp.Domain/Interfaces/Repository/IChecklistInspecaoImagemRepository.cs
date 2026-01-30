using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

// Contrato de persistencia das imagens do checklist de inspecao.
public interface IChecklistInspecaoImagemRepository
{
    // Lista imagens de um checklist.
    Task<List<ChecklistInspecaoImagem>> GetByChecklistIdAsync(int checklistId);
    // Busca imagem por id.
    Task<ChecklistInspecaoImagem?> GetByIdAsync(int id);
    // Cria nova imagem.
    Task<ChecklistInspecaoImagem> CreateAsync(ChecklistInspecaoImagem model);
    // Remove imagem existente.
    Task DeleteAsync(ChecklistInspecaoImagem model);
}
