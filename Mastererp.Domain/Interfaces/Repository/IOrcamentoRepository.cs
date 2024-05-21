using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

public interface IOrcamentoRepository
{
    Task<Orcamento> GetByIdAsync(int? id);


    Task<List<Orcamento>> GetAllAsync();

    Task<Orcamento> CreateAsync(Orcamento model);

    Task UpdateAsync(Orcamento model);


    Task DeleteAsync(int id);
}