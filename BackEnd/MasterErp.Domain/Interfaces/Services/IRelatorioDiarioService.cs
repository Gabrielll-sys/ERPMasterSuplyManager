
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;

public interface IRelatorioDiarioService
{
    Task<RelatorioDiario> GetByIdAsync(int? id);

    Task<RelatorioDiario> SearchClient(string cliente);
    Task<List<RelatorioDiario>> GetAllAsync();
   

    Task<RelatorioDiario> CreateAsync();

    Task<RelatorioDiario> UpdateAsync(RelatorioDiario model);

    Task<RelatorioDiario> UpdateCloseRelatorio(int id);
    Task DeleteAsync(int id);
}