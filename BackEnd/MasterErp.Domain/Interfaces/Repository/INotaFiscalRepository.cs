using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

    public interface INotaFiscalRepository
    {
        Task<NotaFiscal> GetByIdAsync(int id);


        Task<List<NotaFiscal>> GetAllAsync();

        Task<NotaFiscal> CreateAsync(NotaFiscal model);

        Task<NotaFiscal> UpdateAsync(NotaFiscal model);


        Task DeleteAsync(int id);

    }

