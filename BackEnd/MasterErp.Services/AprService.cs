using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;

namespace MasterErp.Services;

public class AprService : IAprService, IScopedService
{
    private readonly IAprRepository _aprRepository;

    public AprService(IAprRepository aprRepository)
    {
        _aprRepository = aprRepository;
    }

    public Task<List<Apr>> GetAllAsync()
    {
        return _aprRepository.GetAllAsync();
    }

    public Task<Apr?> GetByIdAsync(int id)
    {
        return _aprRepository.GetByIdAsync(id);
    }

    public Task<Apr> CreateAsync(Apr model)
    {
        return _aprRepository.CreateAsync(model);
    }

    public Task<Apr> UpdateAsync(Apr model)
    {
        return _aprRepository.UpdateAsync(model);
    }

    public Task DeleteAsync(int id)
    {
        return _aprRepository.DeleteAsync(id);
    }
}
