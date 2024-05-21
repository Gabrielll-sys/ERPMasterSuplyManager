using MasterErp.Domain.Models;

namespace SupplyManager.Services;

public interface IRelatorioDiarioService
{
    Task<RelatorioDiario> GetByIdAsync(int? id);
    
    Task<List<RelatorioDiario>> GetAllAsync();

    Task<RelatorioDiario> CreateAsync();

    Task<RelatorioDiario> UpdateAsync(RelatorioDiario model);

    Task<RelatorioDiario> UpdateCloseRelatorio(int id);
    Task DeleteAsync(int id);
}