using SupplyManager.Models;

namespace SupplyManager.Interfaces
{
    public interface IMaterialService
    {

        Task<List<Material>> GetAllAsync();
        Task<Material> GetByIdAsync(int id);
        
        Task<Material> CreateAsync(Material model);
        Task<Material> UpdateAsync(Material model);
        Task DeleteAsync(int id);
    }
}
