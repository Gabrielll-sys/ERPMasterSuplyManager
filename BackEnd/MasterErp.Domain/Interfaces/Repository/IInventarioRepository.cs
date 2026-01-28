using MasterErp.Domain.Models;
using MasterErp.Domain.Models.Pagination;

namespace MasterErp.Domain.Interfaces.Repository;

    public interface IInventarioRepository
    {

        Task<Inventario> GetByIdAsync(int id);


        Task<List<Inventario>> GetAllAsync();
        Task<List<Inventario>> GetByMaterialIdAsync(int materialId);
        Task<PagedResult<Inventario>> GetPagedAsync(PaginationParams paginationParams);

        Task<Inventario> CreateAsync(Inventario model);

        Task<Inventario> UpdateAsync(Inventario inventario);

        Task<Inventario> BuscaDescricao(string descricao);

        Task DeleteAsync(int id);
    }


