using SupplyManager.Models;

namespace SupplyManager.Interfaces
{
    public interface IFornecedorRepository
    {
        Task<Fornecedor> GetByIdAsync(int id);

        Task<List<Fornecedor>> GetAllAsync();

        Task<Fornecedor> CreateAsync(Fornecedor model);

        Task<Fornecedor> UpdateAsync(Fornecedor model);


        Task DeleteAsync(int id);
    }
}
