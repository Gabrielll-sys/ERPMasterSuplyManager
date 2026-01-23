using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

public interface IAprRepository
{
    Task<Apr?> GetByIdAsync(int id);

    Task<List<Apr>> GetAllAsync();

    Task<Apr> CreateAsync(Apr model);

    Task<Apr> UpdateAsync(Apr model);

    Task DeleteAsync(int id);
}
