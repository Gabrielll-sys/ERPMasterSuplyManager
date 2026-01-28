
using MasterErp.Domain.Models;
using MasterErp.Domain.Models.Pagination;

namespace MasterErp.Domain.Interfaces.Services;


    public interface IInventarioService
    {

        Task <List<Inventario>> GetAllInventarioAsync();
        Task<PagedResult<Inventario>> GetPagedAsync(PaginationParams paginationParams);
        Task <Inventario> GetByIdAsync (int id);
        /// <summary>
        /// Get the last move register os move of some material
        /// </summary>
        /// <param name="id">If of material</param>
        /// <returns>The last register of some material</returns>
        Task <Inventario> GetLastRegister (int id);
        Task <List<Inventario>> GetByCodigoFabricante (string codigoFabricante);

        Task <List<Inventario>> GetByDescricao (string descricao);
        Task <Inventario> CreateAsync (Inventario model);
        Task <Inventario> RemoveQuantidadeEstoque (Inventario model);
        Task <Inventario> UpdateAsync (Inventario model);




    }

