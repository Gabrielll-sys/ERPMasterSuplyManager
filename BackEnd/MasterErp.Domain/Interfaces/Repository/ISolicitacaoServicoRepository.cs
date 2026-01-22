using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

public interface ISolicitacaoServicoRepository
{
    Task<SolicitacaoServico> GetByIdAsync(int? id);

    Task<List<SolicitacaoServico>> GetAllAsync();

    Task<SolicitacaoServico> CreateAsync(SolicitacaoServico model);

    Task UpdateAsync(SolicitacaoServico model);

    Task DeleteAsync(int id);
}
