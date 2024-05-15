using SupplyManager.Models;

namespace SupplyManager.Repository;

public interface IClienteRepository
{
    
    Task<Cliente> GetByIdAsync(int? id);


    Task<List<Cliente>> GetAllAsync();

    Task<Cliente> CreateAsync(Cliente model);

    Task<Cliente> UpdateAsync (Cliente model);


    Task DeleteAsync(int id);
}