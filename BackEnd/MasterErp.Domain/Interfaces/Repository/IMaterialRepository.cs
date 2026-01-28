using MasterErp.Domain.Models;
using MasterErp.Domain.Models.Pagination;

namespace MasterErp.Domain.Interfaces.Repository;

    public interface IMaterialRepository
    {

        Task<Material> GetByIdAsync(int? id);


        Task<List<Material>> GetAllAsync();
        Task<PagedResult<Material>> GetPagedAsync(PaginationParams paginationParams);

        Task<Material> CreateAsync(Material model);

        Task<Material> UpdateAsync(Material model);

        Task DeleteAsync(int id);

    }

