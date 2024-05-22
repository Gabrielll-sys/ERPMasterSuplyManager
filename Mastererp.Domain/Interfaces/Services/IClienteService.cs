
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;
{
    public interface IClienteService
    {

        Task<List<Cliente>> GetAllAsync();
        Task<Cliente> GetByIdAsync(int id);
        
        Task<Cliente> CreateAsync(Cliente model);
        Task<Cliente> UpdateAsync(Cliente model);
        Task DeleteAsync(int id);
    }
}
