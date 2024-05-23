using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

    public interface IInventarioRepository
    {

        Task<Inventario> GetByIdAsync(int id);


        Task<List<Inventario>> GetAllAsync();

        Task<Inventario> CreateAsync(Inventario model);

        Task<Inventario> UpdateAsync(Inventario inventario);

        Task<Inventario> BuscaDescricao(string descricao);

        Task DeleteAsync(int id);
    }


