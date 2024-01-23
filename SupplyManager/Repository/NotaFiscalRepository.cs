using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Interfaces;
using SupplyManager.Models;

namespace SupplyManager.Repository
{
    public class NotaFiscalRepository : INotaFiscalRepository    {
        private readonly SqlContext _context;

        public NotaFiscalRepository(SqlContext context)
        {
          _context = context;
        }

        public async Task<NotaFiscal> CreateAsync(NotaFiscal model)
        {
            try
            {
                var all = await _context.NotasFiscais.ToListAsync();

                await _context.NotasFiscais.AddAsync(model);

                model.Id = all.Count + 1;
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
                var notaFiscal = await _context.NotasFiscais.FindAsync(id)?? throw new KeyNotFoundException();

                _context.Remove(notaFiscal);

                await _context.SaveChangesAsync();
               

            }
            catch (Exception)
            {
                throw;
            }
        }

         public async Task<List<NotaFiscal>> GetAllAsync()
        {
            return await _context.NotasFiscais.ToListAsync();
        }

        public async Task<NotaFiscal> GetByIdAsync(int id)
        {
            try
            {
                var notaFiscal = await _context.NotasFiscais.FindAsync(id) ?? throw new KeyNotFoundException();

                return notaFiscal;

            }
            catch(Exception)
            {
                throw;
            }
           

        }

       public async Task<NotaFiscal> UpdateAsync(NotaFiscal model)
        {
            try
            {

                _ = await _context.NotasFiscais.FindAsync(model.Id)?? throw new KeyNotFoundException();
                _context.NotasFiscais.Update(model);
                _context.SaveChangesAsync();
                return model;




            }
            catch (Exception)
            {
                throw;
            }

        }
    }
}
