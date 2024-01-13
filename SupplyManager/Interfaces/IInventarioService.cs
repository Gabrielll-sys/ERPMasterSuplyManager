using SupplyManager.Models;

namespace SupplyManager.Interfaces
{
    public interface IInventarioService
    {

        Task <List<Inventario>> GetAllInventarioAsync();
        Task <Inventario> GetByIdAsync (int id);
        /// <summary>
        /// Get the last move register os move of some material
        /// </summary>
        /// <param name="id">If of material</param>
        /// <returns>The last register of some material</returns>
        Task <Inventario> GetLastRegister (int id);
        Task <Inventario> GetByCodigoFabricante (string codigoFabricante);
        Task <Inventario> GetByDescricao (string descricao);
        Task <Inventario> CreateAsync (Inventario model);
        Task <Inventario> UpdateAsync (Inventario model);




    }
}
