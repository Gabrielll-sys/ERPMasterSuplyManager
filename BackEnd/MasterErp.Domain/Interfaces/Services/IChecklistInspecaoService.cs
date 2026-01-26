using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;

// Contrato da camada de servico do checklist de inspecao.
public interface IChecklistInspecaoService
{
    // Lista registros para historico.
    Task<List<ChecklistInspecao>> GetAllAsync();
    // Busca um registro especifico.
    Task<ChecklistInspecao?> GetByIdAsync(int id);
    // Cria um novo registro.
    Task<ChecklistInspecao> CreateAsync(ChecklistInspecao model);
    // Atualiza um registro existente.
    Task<ChecklistInspecao> UpdateAsync(ChecklistInspecao model);
    // Remove um registro.
    Task DeleteAsync(int id);
}
