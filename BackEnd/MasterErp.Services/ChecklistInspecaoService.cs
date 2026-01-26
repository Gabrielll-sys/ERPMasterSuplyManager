using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;

namespace MasterErp.Services;

// Servico de negocio do checklist de inspecao.
public class ChecklistInspecaoService : IChecklistInspecaoService, IScopedService
{
    private readonly IChecklistInspecaoRepository _repository;

    public ChecklistInspecaoService(IChecklistInspecaoRepository repository)
    {
        _repository = repository;
    }

    public Task<List<ChecklistInspecao>> GetAllAsync()
    {
        return _repository.GetAllAsync();
    }

    public Task<ChecklistInspecao?> GetByIdAsync(int id)
    {
        return _repository.GetByIdAsync(id);
    }

    public Task<ChecklistInspecao> CreateAsync(ChecklistInspecao model)
    {
        return _repository.CreateAsync(model);
    }

    public Task<ChecklistInspecao> UpdateAsync(ChecklistInspecao model)
    {
        return _repository.UpdateAsync(model);
    }

    public Task DeleteAsync(int id)
    {
        return _repository.DeleteAsync(id);
    }
}
