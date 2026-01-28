
using MasterErp.Domain.Models;
using MasterErp.Domain.Models.Pagination;

namespace MasterErp.Domain.Interfaces.Services;

    public interface IMaterialService
    {

        Task<List<Material>> GetAllAsync();
        Task<PagedResult<Material>> GetPagedAsync(PaginationParams paginationParams);
        Task<Material> GetByIdAsync(int id);
        
        Task<Material> CreateAsync(Material model);
        Task<Material> UpdateAsync(Material model);
        Task DeleteAsync(int id);
    }

