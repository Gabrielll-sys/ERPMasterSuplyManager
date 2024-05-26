using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

public interface IAtividadeRdRepository
{
    
    Task<AtividadeRd> GetByIdAsync(int? id);


    Task<List<AtividadeRd>> GetAllAsync();

    Task<AtividadeRd> CreateAsync(AtividadeRd model);

    Task<AtividadeRd> UpdateAsync (AtividadeRd model);


    Task DeleteAsync(int id);
}