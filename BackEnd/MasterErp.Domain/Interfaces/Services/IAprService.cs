using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;

public interface IAprService
{
    Task<List<Apr>> GetAllAsync();

    Task<Apr?> GetByIdAsync(int id);

    Task<Apr> CreateAsync(Apr model);

    Task<Apr> UpdateAsync(Apr model);

    Task DeleteAsync(int id);
}
