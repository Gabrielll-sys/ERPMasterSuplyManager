
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;
{
    public interface IItemNotaFiscalService
    {
        Task<ItemNotaFiscal> GetByIdAsync(int id);


        Task<List<ItemNotaFiscal>> GetAllAsync();

        Task<ItemNotaFiscal> CreateAsync(ItemNotaFiscal model);

        Task<ItemNotaFiscal> UpdateAsync(ItemNotaFiscal model);


        Task DeleteAsync(int id);
    }
}
