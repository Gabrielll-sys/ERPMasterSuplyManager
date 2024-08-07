
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;

public interface ITarefaUsuarioService
{
    Task<TarefaUsuario> GetByIdAsync(int? id);
    
    Task<List<TarefaUsuario>> GetAllAsync();

    Task<TarefaUsuario> CreateAsync(TarefaUsuario model);

    Task<TarefaUsuario> UpdateAsync(TarefaUsuario model);

    Task<List<TarefaUsuario>> SearchUserTasksByDate(DateTime date);

    Task DeleteAsync(int id);
}