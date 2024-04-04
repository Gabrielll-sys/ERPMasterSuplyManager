using SupplyManager.Models;

namespace SupplyManager.Interfaces
{
    public interface IItemNotaFiscalRepository
    {

        Task<ItemNotaFiscal> GetByIdAsync(int? id);


        Task<List<ItemNotaFiscal>> GetAllAsync();

        Task<ItemNotaFiscal> CreateAsync(ItemNotaFiscal model);

        Task<ItemNotaFiscal> UpdateAsync(ItemNotaFiscal model);


        Task DeleteAsync(int id);
    }
}
