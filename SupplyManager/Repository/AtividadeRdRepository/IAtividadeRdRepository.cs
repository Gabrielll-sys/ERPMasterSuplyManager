using SupplyManager.Models;

namespace SupplyManager.Repository;

public interface IAtividadeRdRepository
{
    
    Task<AtividadeRd> GetByIdAsync(int? id);


    Task<List<AtividadeRd>> GetAllAsync();

    Task<AtividadeRd> CreateAsync(AtividadeRd model);

    Task<AtividadeRd> UpdateAsync (AtividadeRd model);


    Task DeleteAsync(int id);
}