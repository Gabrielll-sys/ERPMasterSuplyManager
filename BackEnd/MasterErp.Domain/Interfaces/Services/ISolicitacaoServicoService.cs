using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;

public interface ISolicitacaoServicoService
{
    Task<List<SolicitacaoServico>> GetAllAsync();
    Task<SolicitacaoServico> GetByIdAsync(int? id);
    Task<SolicitacaoServico> CreateAsync(SolicitacaoServico model);
    Task<SolicitacaoServico> UpdateAsync(SolicitacaoServico model);
    Task DeleteAsync(int id);
    
    /// <summary>
    /// Aceita uma solicitação de serviço, registrando o usuário logado como responsável
    /// </summary>
    Task<SolicitacaoServico> AceitarAsync(int id);
    
    /// <summary>
    /// Conclui uma solicitação de serviço, registrando os usuários responsáveis pela conclusão
    /// </summary>
    Task<SolicitacaoServico> ConcluirAsync(int id, List<string> usuarios);
}
