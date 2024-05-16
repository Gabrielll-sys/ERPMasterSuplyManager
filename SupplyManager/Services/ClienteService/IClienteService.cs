using SupplyManager.Models;

namespace SupplyManager.Interfaces
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
