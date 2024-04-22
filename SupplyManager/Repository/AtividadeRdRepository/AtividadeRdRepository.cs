using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;

namespace SupplyManager.Repository;

public class AtividadeRdRepository : IAtividadeRdRepository
{
    private readonly SqlContext _context;
    
    
            public AtividadeRdRepository(SqlContext context)
            {
                _context = context;
            }
    
            public async Task<List<AtividadeRd>> GetAllAsync()
            {
                try
                {
                    return await _context.AtividadesRd.ToListAsync();
    
                }
                catch (Exception)
                {
                    throw;
                }
            }
    
            public async Task<AtividadeRd> GetByIdAsync(int? id)
            {
    
                try
                {
                    return await _context.AtividadesRd.FindAsync(id);
    
    
                }
                catch (Exception)
                {
                    throw;
                }
            }
            public async Task<AtividadeRd> CreateAsync(AtividadeRd model)
            {
    
                try
                {
                    
                   var a =  await _context.AtividadesRd.AddAsync(model);
    
                    await _context.SaveChangesAsync();
    
                    return model;
    
    
                }
                catch (Exception)
                {
    
                    throw;
                }
    
            }
            public async Task<AtividadeRd> UpdateAsync(AtividadeRd model)
            {
                try
                {
    
                    _ = await _context.AtividadesRd.FindAsync(model.Id) ?? throw new KeyNotFoundException();
    
                    _context.AtividadesRd.Update(model);
    
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
    
                    var atividadeRd = await _context.AtividadesRd.FindAsync(id) ?? throw new KeyNotFoundException();
    
                    _context.Remove(atividadeRd);
    
                    await _context.SaveChangesAsync();
                }
    
                catch (Exception)
                {
    
                    throw;
                }
            }
    
    
        }
