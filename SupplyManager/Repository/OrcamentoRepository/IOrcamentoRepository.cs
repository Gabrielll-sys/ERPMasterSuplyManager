using SupplyManager.Models;

namespace SupplyManager.Repository;

public interface IOrcamentoRepository
{
    Task<Orcamento> GetByIdAsync(int? id);


    Task<List<Orcamento>> GetAllAsync();

    Task<Orcamento> CreateAsync(Orcamento model);

    Task UpdateAsync(Orcamento model);


    Task DeleteAsync(int id);
}