using Microsoft.EntityFrameworkCore;
using MasterErp.Infraestructure;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;

namespace MasterErp.Infraestructure;

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
                    return await _context.AtividadesRd.AsNoTracking().ToListAsync();
    
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
                    return await _context.AtividadesRd.AsNoTracking().FirstOrDefaultAsync(x=>x.Id==id);
                   
    
    
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
                    //Esta linha serve para NÃO criar um relatorio diario junto quando cria um Atividade,averiguar depois porquec
                    model.RelatorioDiario = null;
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
                    //Esta linha serve para NÃO criar um relatorio diario junto quando atualiza um Atividade,averiguar depois porquec

                    model.RelatorioDiario = null;

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

                    var atividadeRd = await GetByIdAsync(id);
    
                    _context.Remove(atividadeRd);
    
                    await _context.SaveChangesAsync();
                }
    
                catch (Exception)
                {
    
                    throw;
                }
            }
    
    
        }
