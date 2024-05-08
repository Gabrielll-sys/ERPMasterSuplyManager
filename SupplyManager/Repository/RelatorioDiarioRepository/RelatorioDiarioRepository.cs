using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;

namespace SupplyManager.Repository;

public class RelatorioDiarioRepository:IRelatorioDiarioRepository
{
    
     private readonly SqlContext _context;
        public RelatorioDiarioRepository( SqlContext context) 
        { 
            _context = context;
        }

        public async Task<List<RelatorioDiario>> GetAllAsync()
        {
            try
            {
                return await _context.RelatorioDiarios.AsNoTracking().OrderByDescending(x => x.HorarioAbertura).ToListAsync();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<RelatorioDiario> GetByIdAsync(int? id)
        {

            try
            {
                return await _context.RelatorioDiarios.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);


            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public async Task<RelatorioDiario> CreateAsync(RelatorioDiario model)
        {

            try
            {

                model.Id = null;

                await _context.RelatorioDiarios.AddAsync(model);

                await _context.SaveChangesAsync();

                return model;


            }
            catch (Exception)
            {

                throw;
            }

        }
        public async Task<RelatorioDiario> UpdateAsync(RelatorioDiario model)
        {
            try
            {

                _context.RelatorioDiarios.Update(model);

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

                var material = await _context.RelatorioDiarios.FindAsync(id) ?? throw new KeyNotFoundException();

                _context.Remove(material);

                _context.SaveChanges();
            }

            catch (Exception)
            {

                throw;
            }
        }
    
    
    
    
}