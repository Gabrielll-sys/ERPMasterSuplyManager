using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

public interface ILogAcoesUsuarioRepository
{
    Task<LogAcoesUsuario> GetByIdAsync(int? id);
    
    Task<List<LogAcoesUsuario>> GetAllAsync();

    Task<LogAcoesUsuario> CreateAsync(LogAcoesUsuario model);

}