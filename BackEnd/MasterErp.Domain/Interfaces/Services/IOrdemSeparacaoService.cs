
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;

    public interface IOrdemSeparacaoService
    {
        Task<List<OrdemSeparacao>> GetAllAsync();
        Task<OrdemSeparacao> GetByIdAsync(int? id);
        
        Task<OrdemSeparacao> CreateAsync(OrdemSeparacao model);
        Task<OrdemSeparacao> UpdateAsync(OrdemSeparacao model);
        Task DeleteAsync(int id);
    }

