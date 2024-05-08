using SupplyManager.Models;

namespace SupplyManager.Repository;

public interface IRelatorioDiarioRepository
{
    Task<RelatorioDiario> GetByIdAsync(int? id);
    
    Task<List<RelatorioDiario>> GetAllAsync();

    Task<RelatorioDiario> CreateAsync(RelatorioDiario model);

    Task<RelatorioDiario> UpdateAsync(RelatorioDiario model);
    
    Task DeleteAsync(int id);
}