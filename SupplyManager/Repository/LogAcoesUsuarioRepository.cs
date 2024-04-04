using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;

namespace SupplyManager.Repository;

public class LogAcoesUsuarioRepository: ILogAcoesUsuarioRepository
{
     private readonly SqlContext _context;
    
    
            public LogAcoesUsuarioRepository(SqlContext context)
            {
                _context = context;
            }
    
            public async Task<List<LogAcoesUsuario>> GetAllAsync()
            {
                try
                {
                    return await _context.LogAcoesUsuarios.AsNoTracking().OrderBy(x=>x.Id).ToListAsync();
    
                }
                catch (Exception)
                {
                    throw;
                }
            }
    
            public async Task<LogAcoesUsuario> GetByIdAsync(int? id)
            {
    
                try
                {
                    return await _context.LogAcoesUsuarios.AsNoTracking().FirstOrDefaultAsync(x=>x.Id==id);
    
    
                }
                catch (Exception)
                {
                    throw;
                }
            }
            public async Task<LogAcoesUsuario> CreateAsync(LogAcoesUsuario model)
            {
    
                try
                {
                    model.Id = null;
    
                    await _context.LogAcoesUsuarios.AddAsync(model);
    
                    await _context.SaveChangesAsync();
    
                    return model;
                  
    
                }
                catch(Exception) 
                {
    
                    throw;
                }
    
            }

          
}