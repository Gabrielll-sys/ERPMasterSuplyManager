using SupplyManager.Models;

namespace SupplyManager.Interfaces
{
    public interface IMaterialRepository
    {

        Task<Material> GetByIdAsync(int? id);


        Task<List<Material>> GetAllAsync();

        Task<Material> CreateAsync(Material model);

        Task<Material> UpdateAsync(Material model);


        Task DeleteAsync(int id);

    }
}
