using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;
public interface ILogAcoesUsuarioService
{
    Task<List<LogAcoesUsuario>> GetAllAsync();
    
    Task<LogAcoesUsuario> GetByIdAsync(int id);
        
    Task<LogAcoesUsuario> CreateAsync(LogAcoesUsuario model);

    Task<List<LogAcoesUsuario>> GetByLogByDateInterval(DateTime date);
}