using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;
{
    public interface IItemRepository
    {
        Task<Item> GetByIdAsync(int id);


        Task<List<Item>> GetAllAsync();

        Task<Item> CreateAsync(Item model);

        Task UpdateAsync(Item inventario);


        Task DeleteAsync(int id);


    }
}
