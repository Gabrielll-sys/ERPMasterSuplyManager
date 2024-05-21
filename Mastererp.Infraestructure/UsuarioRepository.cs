using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Interfaces;
using SupplyManager.Models;

namespace SupplyManager.Repository
{
    public class UsuarioRepository: IUsuarioRepository
    {

        private readonly SqlContext _context;
        public UsuarioRepository( SqlContext context) 
        { 
            _context = context;
        }

        public async Task<List<Usuario>> GetAllAsync()
        {
            try
            {
                return await _context.Usuarios.AsNoTracking().OrderBy(x => x.Id).ToListAsync();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Usuario> GetByIdAsync(int? id)
        {

            try
            {
                return await _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);


            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Usuario> ExistsAsync(string email)
        {

            try
            {
                return await _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(x=>x.Email==email);



            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Usuario> CreateAsync(Usuario model)
        {

            try
            {
                model.Id = null;

                await _context.Usuarios.AddAsync(model);

                await _context.SaveChangesAsync();

                return model;


            }
            catch (Exception)
            {

                throw;
            }

        }
        public async Task<Usuario> UpdateAsync(Usuario model)
        {
            try
            {

                _context.Usuarios.Update(model);

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

                var material = await _context.Usuarios.FindAsync(id) ?? throw new KeyNotFoundException();

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
