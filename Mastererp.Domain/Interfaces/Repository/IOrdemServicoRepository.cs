using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Interfaces
{
    public interface IOrdemServicoRepository
    {
        Task<OrdemServico> GetByIdAsync(int? id);


        Task<List<OrdemServico>> GetAllAsync();

        Task<OrdemServico> CreateAsync(OrdemServico model);

        Task UpdateAsync(OrdemServico model);


        Task DeleteAsync(int id);

    }
}
