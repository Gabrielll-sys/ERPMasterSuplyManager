using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Interfaces;
using SupplyManager.Models;

namespace SupplyManager.Repository
{
    public class ItemNotaFiscalRepository:IItemNotaFiscalRepository
    {
        private readonly SqlContext _context;

        public ItemNotaFiscalRepository(SqlContext context)
        {
            _context = context;
        }

        public async Task<ItemNotaFiscal> CreateAsync(ItemNotaFiscal model)
        {
            try
            {
                var all = await _context.ItensNotaFiscal.ToListAsync();

                await _context.ItensNotaFiscal.AddAsync(model);

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
                var notaFiscal = await _context.ItensNotaFiscal.FindAsync(id) ?? throw new KeyNotFoundException();

                _context.Remove(notaFiscal);

                await _context.SaveChangesAsync();


            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<ItemNotaFiscal>> GetAllAsync()
        {
            return await _context.ItensNotaFiscal.ToListAsync();
        }

        public async Task<ItemNotaFiscal> GetByIdAsync(int? id)
        {
            try
            {
                var itemNotaFiscal = await _context.ItensNotaFiscal.FindAsync(id) ?? throw new KeyNotFoundException();

                return itemNotaFiscal;

            }
            catch (Exception)
            {
                throw;
            }


        }

        public async Task<ItemNotaFiscal> UpdateAsync(ItemNotaFiscal model)
        {
            try
            {

                _ = await _context.ItensNotaFiscal.FindAsync(model.Id) ?? throw new KeyNotFoundException();
                _context.ItensNotaFiscal.Update(model);
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
