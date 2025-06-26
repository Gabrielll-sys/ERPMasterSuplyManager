using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;
using MasterErp.Infraestructure.Context;
using MasterErp.Domain.Interfaces.Services;
namespace MasterErp.Infraestructure
{
    
public class TarefaUsuarioRepository : ITarefaUsuarioRepository, IScopedService
    {
            private readonly SqlContext _context;
    
    
            public TarefaUsuarioRepository(SqlContext context)
            {
                _context = context;
            }


        public async Task<List<TarefaUsuario>> GetAllAsync()
        {
            try
            {
                return await _context.TarefaUsuarios.AsNoTracking().ToListAsync();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<TarefaUsuario> GetByIdAsync(int? id)
        {

            try
            {
                return await _context.TarefaUsuarios.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);


            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<TarefaUsuario> CreateAsync(TarefaUsuario model)
        {

            try
            {
                model.Usuario = null;
                model.Id = null;

                TarefaUsuario t1 = new TarefaUsuario(model.NomeTarefa,model.Prioridade);

                await _context.TarefaUsuarios.AddAsync(model);

                await _context.SaveChangesAsync();

                return model;


            }
            catch (Exception)
            {

                throw;
            }

        }
        public async Task<TarefaUsuario> UpdateAsync(TarefaUsuario model)
        {
            try
            {
                model.Usuario = null;

                _context.TarefaUsuarios.Update(model);

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

                var material = await _context.TarefaUsuarios.FindAsync(id) ?? throw new KeyNotFoundException();

                _context.Remove(material);

               await  _context.SaveChangesAsync();
            }

            catch (Exception)
            {

                throw;
            }
        }
    }
}

