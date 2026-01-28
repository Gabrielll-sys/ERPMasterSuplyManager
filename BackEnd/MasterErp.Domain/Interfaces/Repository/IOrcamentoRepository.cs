using MasterErp.Domain.Models;
using MasterErp.Domain.Models.Pagination;

namespace MasterErp.Domain.Interfaces.Repository;

public interface IOrcamentoRepository
{
    Task<Orcamento> GetByIdAsync(int? id);


    Task<List<Orcamento>> GetAllAsync();
    Task<PagedResult<Orcamento>> GetPagedAsync(PaginationParams paginationParams);

    Task<Orcamento> CreateAsync(Orcamento model);

    Task UpdateAsync(Orcamento model);


    Task DeleteAsync(int id);
}