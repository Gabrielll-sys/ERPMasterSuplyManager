using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Interfaces;
using SupplyManager.Models;

namespace SupplyManager.Repository
{
    public class FornecedorRepository:IFornecedorRepository
    {
        private readonly SqlContext _context;

        public FornecedorRepository(SqlContext context)
        {
            _context = context;
        }

        public async Task<Fornecedor> CreateAsync(Fornecedor model)
        {
            try
            {
                var all = await _context.Fornecedores.ToListAsync();

                await _context.Fornecedores.AddAsync(model);

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
                var notaFiscal = await _context.Fornecedores.FindAsync(id) ?? throw new KeyNotFoundException();

                _context.Remove(notaFiscal);

                await _context.SaveChangesAsync();


            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<Fornecedor>> GetAllAsync()
        {
            return await _context.Fornecedores.ToListAsync();
        }

        public async Task<Fornecedor> GetByIdAsync(int id)
        {
            try
            {
                var fornecedor = await _context.Fornecedores.FindAsync(id) ?? throw new KeyNotFoundException();

                return fornecedor;

            }
            catch (Exception)
            {
                throw;
            }


        }

        public async Task<Fornecedor> UpdateAsync(Fornecedor model)
        {
            try
            {

                _ = _context.Fornecedores.Find(model.Id) ?? throw new KeyNotFoundException();
                _context.Fornecedores.Update(model);
                _context.SaveChanges();

                return model;



            }
            catch (Exception)
            {
                throw;
            }

        }





    }
}
