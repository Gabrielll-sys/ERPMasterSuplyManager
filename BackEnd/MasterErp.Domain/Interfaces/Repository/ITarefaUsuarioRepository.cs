using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

    public interface ITarefaUsuarioRepository
    {

        Task<TarefaUsuario> GetByIdAsync(int? id);


        Task<List<TarefaUsuario>> GetAllAsync();

        Task<TarefaUsuario> CreateAsync(TarefaUsuario model);

        Task<TarefaUsuario> UpdateAsync(TarefaUsuario inventario);

        Task DeleteAsync(int id);
    }

