
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;
{
    public interface IOrdemServicoService
    {
        Task<List<OrdemServico>> GetAllAsync();
        Task<OrdemServico> GetByIdAsync(int? id);
        
        Task<OrdemServico> CreateAsync(OrdemServico model);
        Task<OrdemServico> UpdateAsync(OrdemServico model);
        Task DeleteAsync(int id);
    }
}
