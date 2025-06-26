using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;
using MasterErp.Infraestructure.Context;
using MasterErp.Domain.Interfaces.Services;


namespace MasterErp.Infraestructure;

    public class OrdemSeparacaoRepository: IOrdemSeparacaoRepository,IScopedService

    {

        private readonly SqlContext _context;


        public OrdemSeparacaoRepository(SqlContext context)
        {
            _context = context;
        }

        public async Task<List<OrdemSeparacao>> GetAllAsync()
        {
            try
            {
                return await _context.OrdemSeparacoes.ToListAsync();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<OrdemSeparacao> GetByIdAsync(int? id)
        {

            try
            {
                return await _context.OrdemSeparacoes.FindAsync(id);


            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<OrdemSeparacao> CreateAsync(OrdemSeparacao model)
        {

            try
            {
                await _context.OrdemSeparacoes.AddAsync(model);

                await _context.SaveChangesAsync();

                return model;


            }
            catch (Exception)
            {

                throw;
            }

        }
        public async Task UpdateAsync(OrdemSeparacao model)
        {
            try
            {

                _ = await _context.OrdemSeparacoes.FindAsync(model.Id) ?? throw new KeyNotFoundException();

                _context.OrdemSeparacoes.Update(model);

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

                var ordemServico = await _context.OrdemSeparacoes.FindAsync(id) ?? throw new KeyNotFoundException();

                _context.Remove(ordemServico);

                await _context.SaveChangesAsync();
            }

            catch (Exception)
            {

                throw;
            }
        }


    }

