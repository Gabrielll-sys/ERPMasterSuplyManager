using SupplyManager.Models;

namespace SupplyManager.Interfaces
{
    public interface IMaterialService
    {

        Task<List<Material>> GetAllMateriaisAsync();
        Task<Material> GetByIdAsync(int id);
        /// <summary>
        /// Get the last move register os move of some material
        /// </summary>
        /// <param name="id">If of material</param>
        /// <returns>The last register of some material</returns>


        Task<Material> CreateAsync(Material model);
        Task<Material> UpdateAsync(Material model);
        Task DeleteAsync(int id);
    }
}
