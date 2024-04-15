using SupplyManager.Models;

namespace SupplyManager.Services;

public interface IAtividadeRdService 
{
    Task<AtividadeRd> GetByIdAsync(int id);

    Task<List<AtividadeRd>> GetAllAsync();

    Task<AtividadeRd> CreateAsync(AtividadeRd model);

    Task<AtividadeRd> UpdateAsync(AtividadeRd model);
    
    Task DeleteAsync(int id);
}