using Microsoft.EntityFrameworkCore;
using MasterErp.Infraestructure.Context;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;
namespace MasterErp.Infraestructure;

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
