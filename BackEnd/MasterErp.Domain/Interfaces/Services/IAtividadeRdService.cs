
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;
public interface IAtividadeRdService 
{
    Task<AtividadeRd> GetByIdAsync(int id);

    Task<List<AtividadeRd>> GetAllAsync();
    Task<List<AtividadeRd>> GetAllInRdAsync(int? id);

    Task<AtividadeRd> CreateAsync(AtividadeRd model);

    Task<AtividadeRd> UpdateAsync(AtividadeRd model);
    
    Task DeleteAsync(int id);
}