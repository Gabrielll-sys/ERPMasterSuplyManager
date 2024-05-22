
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;
public interface IOrcamentoService
{
    Task<List<Orcamento>> GetAllAsync();
    
    Task<Orcamento> GetByIdAsync(int? id);

    Task<List<Orcamento>> GetByClientName(string name);
    //Metodo para buscar o primeiro cadastro daquele cliente,para no front ser preenchido automaticamente
    
    Task<Orcamento> GetClient(string name);

    Task<Orcamento> CreateAsync(Orcamento model);
    
    Task<Orcamento> UpdateAsync(Orcamento model);
    
    Task DeleteAsync(int id);
}