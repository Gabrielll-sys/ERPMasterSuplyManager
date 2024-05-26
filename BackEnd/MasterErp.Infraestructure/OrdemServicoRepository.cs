using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;


namespace MasterErp.Infraestructure;

    public class OrdemServicoRepository: IOrdemServicoRepository

    {

        private readonly SqlContext _context;


        public OrdemServicoRepository(SqlContext context)
        {
            _context = context;
        }

        public async Task<List<OrdemServico>> GetAllAsync()
        {
            try
            {
                return await _context.OrdemServicos.ToListAsync();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<OrdemServico> GetByIdAsync(int? id)
        {

            try
            {
                return await _context.OrdemServicos.FindAsync(id);


            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<OrdemServico> CreateAsync(OrdemServico model)
        {

            try
            {
                await _context.OrdemServicos.AddAsync(model);

                await _context.SaveChangesAsync();

                return model;


            }
            catch (Exception)
            {

                throw;
            }

        }
        public async Task UpdateAsync(OrdemServico model)
        {
            try
            {

                _ = await _context.OrdemServicos.FindAsync(model.Id) ?? throw new KeyNotFoundException();

                _context.OrdemServicos.Update(model);

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

                var ordemServico = await _context.OrdemServicos.FindAsync(id) ?? throw new KeyNotFoundException();

                _context.Remove(ordemServico);

                await _context.SaveChangesAsync();
            }

            catch (Exception)
            {

                throw;
            }
        }


    }

