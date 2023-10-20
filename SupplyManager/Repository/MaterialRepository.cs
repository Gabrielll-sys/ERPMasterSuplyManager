using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
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
        public async Task<List<Inventario>> GetAll()
        {
            try
            {
                return (await _context.Inventarios.ToListAsync());

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Inventario> GetById(int id)
        {

            try
            {
                var inventario = await _context.Inventarios.FindAsync(id);

                return (inventario);

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task DeleteInventario(int id)
        {
            var invetario = await _context.Inventarios.FindAsync(id) ??throw new KeyNotFoundException();

            _context.Remove(invetario);

            _context.SaveChanges();
        }

       



        public async Task UpdateInventario(Inventario inventario)
        {
           _ = await _context.Inventarios.FindAsync(inventario.Id)?? throw new KeyNotFoundException();

            _context.Inventarios.Update(inventario);

            await _context.SaveChangesAsync();


        }
    }
}
