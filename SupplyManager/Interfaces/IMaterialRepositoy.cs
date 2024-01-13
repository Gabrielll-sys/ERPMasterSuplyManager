using SupplyManager.Models;

namespace SupplyManager.Interfaces
{
    public interface IMaterialRepositoy
    {

        Task<Material> GetByIdAsync(int id);


        Task<List<Material>> GetAllAsync();

        Task<Material> CreateAsync(Material model);

        Task UpdateAsync(Material inventario);


        Task DeleteAsync(int id);

    }
}
