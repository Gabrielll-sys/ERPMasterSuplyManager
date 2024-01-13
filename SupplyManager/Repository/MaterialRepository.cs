using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Interfaces;
using SupplyManager.Models;

namespace SupplyManager.Repository
{
    public class MaterialRepository :IMaterialRepositoy
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
                return await _context.Materiais.ToListAsync();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Material> GetByIdAsync(int id)
        {

            try
            {
                return await _context.Materiais.FindAsync(id);


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
                await _context.Materiais.AddAsync(model);

                await _context.SaveChangesAsync();

                return model;
              

            }
            catch(Exception) 
            {

                throw;
            }

        }
        public async Task UpdateAsync(Material model)
        {
            try
            {

            _ = await _context.Materiais.FindAsync(model.Id) ?? throw new KeyNotFoundException();

            _context.Materiais.Update(model);

            await _context.SaveChangesAsync();

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

            _context.SaveChanges();
            }

              catch (Exception)
            {

                throw;
            }
        }

      
    }
}
