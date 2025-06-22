using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

public interface IOrdemSeparacaoRepository
{
    Task<OrdemSeparacao> GetByIdAsync(int? id);


    Task<List<OrdemSeparacao>> GetAllAsync();

    Task<OrdemSeparacao> CreateAsync(OrdemSeparacao model);

    Task UpdateAsync(OrdemSeparacao model);


    Task DeleteAsync(int id);

}
