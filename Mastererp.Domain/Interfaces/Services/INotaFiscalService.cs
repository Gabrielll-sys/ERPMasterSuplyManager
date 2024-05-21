using MasterErp.Domain.Models;

namespace SupplyManager.Interfaces
{
    public interface INotaFiscalService
    {
        Task<NotaFiscal> GetByIdAsync(int id);


        Task<List<NotaFiscal>> GetAllAsync();

        Task<NotaFiscal> CreateAsync(NotaFiscal model);

        Task<NotaFiscal> UpdateAsync(NotaFiscal model);


        Task DeleteAsync(int id);
    }
}
