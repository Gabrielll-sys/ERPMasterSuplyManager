using SupplyManager.Models;

namespace SupplyManager.Services;

public interface IRelatorioDiarioService
{
    Task<RelatorioDiario> GetByIdAsync(int? id);
    
    Task<List<RelatorioDiario>> GetAllAsync();

    Task<RelatorioDiario> CreateAsync();

    Task<RelatorioDiario> UpdateAsync(RelatorioDiario model);
    
    Task DeleteAsync(int id);
}