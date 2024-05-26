using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

public interface IRelatorioDiarioRepository
{
    Task<RelatorioDiario> GetByIdAsync(int? id);
    
    Task<List<RelatorioDiario>> GetAllAsync();

    Task<RelatorioDiario> CreateAsync(RelatorioDiario model);

    Task<RelatorioDiario> UpdateAsync(RelatorioDiario model);
    
    Task DeleteAsync(int id);
}