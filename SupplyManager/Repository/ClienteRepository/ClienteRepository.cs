using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;

namespace SupplyManager.Repository;

public class ClienteRepository : IClienteRepository
{
    private readonly SqlContext _context;
    
    
            public ClienteRepository(SqlContext context)
            {
                _context = context;
            }
    
            public async Task<List<Cliente>> GetAllAsync()
            {
                try
                {
                    return await _context.Clientes.AsNoTracking().ToListAsync();
    
                }
                catch (Exception)
                {
                    throw;
                }
            }
    
            public async Task<Cliente> GetByIdAsync(int? id)
            {
    
                try
                {
                    return await _context.Clientes.AsNoTracking().FirstOrDefaultAsync(x=>x.Id==id);
                   
    
    
                }
                catch (Exception)
                {
                    throw;
                }
            }
            public async Task<Cliente> CreateAsync(Cliente model)
            {
    
                try
                {
           
                   var a =  await _context.Clientes.AddAsync(model);
    
                    await _context.SaveChangesAsync();
    
                    return model;
    
    
                }
                catch (Exception)
                {
    
                    throw;
                }
    
            }
            public async Task<Cliente> UpdateAsync(Cliente model)
            {
                try
                {
                  

                    _context.Clientes.Update(model);
    
                    await _context.SaveChangesAsync();
                    
                    return model;

                }
                catch (Exception)
                {
    
                    throw;
                }
    
            }
            public async Task DeleteAsync(int id)
            {
    
                try
                {

                    var cliente = await GetByIdAsync(id);
    
                    _context.Remove(cliente);
    
                    await _context.SaveChangesAsync();
                }
    
                catch (Exception)
                {
    
                    throw;
                }
            }
    
    
        }
