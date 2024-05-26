using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;


namespace MasterErp.Infraestructure;

    public class ItemRepository : IItemRepository
    {
        private readonly SqlContext _context;


        public ItemRepository(SqlContext context)
        {
            _context = context;
        }

        public async Task<List<Item>> GetAllAsync()
        {
            try
            {
                return await _context.Itens.ToListAsync();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Item> GetByIdAsync(int id)
        {

            try
            {
                return await _context.Itens.FindAsync(id);


            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<Item> CreateAsync(Item model)
        {

            try
            {
                await _context.Itens.AddAsync(model);

                await _context.SaveChangesAsync();

                return model;


            }
            catch (Exception)
            {

                throw;
            }

        }
        public async Task UpdateAsync(Item model)
        {
            try
            {

                _ = await _context.Itens.FindAsync(model.Id) ?? throw new KeyNotFoundException();

                _context.Itens.Update(model);

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

                var item = await _context.Itens.FindAsync(id) ?? throw new KeyNotFoundException();

                _context.Remove(item);

                _context.SaveChanges();
            }

            catch (Exception)
            {

                throw;
            }
        }
    }

