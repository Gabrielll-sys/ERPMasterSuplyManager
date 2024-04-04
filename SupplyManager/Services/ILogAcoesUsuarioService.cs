using SupplyManager.Models;

namespace SupplyManager.Services;

public interface ILogAcoesUsuarioService
{
    Task<List<LogAcoesUsuario>> GetAllAsync();
    
    Task<LogAcoesUsuario> GetByIdAsync(int id);
        
    Task<LogAcoesUsuario> CreateAsync(LogAcoesUsuario model);

    Task<List<LogAcoesUsuario>> GetByLogByDateInterval(DateTime date);
}