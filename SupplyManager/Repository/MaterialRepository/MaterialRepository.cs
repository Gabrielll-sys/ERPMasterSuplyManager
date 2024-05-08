using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Interfaces;
using SupplyManager.Models;

namespace SupplyManager.Repository
{
    public class MaterialRepository :IMaterialRepository
    {
        private readonly SqlContext _context;


        public MaterialRepository(SqlContext context)
        {
            _context = context;
        }

        public async Task<List<Material>> GetAllAsync()
        {
            try
            {
                return await _context.Materiais.AsNoTracking().OrderBy(x=>x.Id).ToListAsync();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Material> GetByIdAsync(int? id)
        {

            try
            {
                return await _context.Materiais.AsNoTracking().FirstOrDefaultAsync(x=>x.Id==id);


            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<Material> CreateAsync(Material model)
        {

            try
            {
                model.Id = null;

                await _context.Materiais.AddAsync(model);

                await _context.SaveChangesAsync();

                return model;
              

            }
            catch(Exception) 
            {

                throw;
            }

        }
        public async Task<Material> UpdateAsync(Material model)
        {
            try
            {

                _context.Materiais.Update(model);

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

                var material = await _context.Materiais.FindAsync(id) ??throw new KeyNotFoundException();

                _context.Remove(material);

                await _context.SaveChangesAsync();
            }

            catch (Exception)
            {

                throw;
            }
        }

      
    }
}
