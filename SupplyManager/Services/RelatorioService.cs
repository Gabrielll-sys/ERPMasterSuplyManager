using Microsoft.EntityFrameworkCore;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class RelatorioDiarioService : IRelatorioDiarioService
    {
        private readonly IRelatorioDiarioService _relatorioDiarioRepository;
        
        public RelatorioDiarioService(IRelatorioDiarioService relatorioDiarioRepository)
        {
            _relatorioDiarioRepository = relatorioDiarioRepository;
        }
        public async Task<List<RelatorioDiario>> GetAllAsync()
        {
            try
            {
                return await _relatorioDiarioRepository.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
        public async Task<RelatorioDiario> GetByIdAsync(int? id)
        {
            try
            {
                return await _relatorioDiarioRepository.GetByIdAsync(id);
            }
            catch
            {
                throw;
            }
        }
        
        
        public async Task<RelatorioDiario> CreateAsync(RelatorioDiario model)
        {
            try
            {
                var all = await _relatorioDiarioRepository.GetAllAsync();


                var relatorioDiario = await _relatorioDiarioRepository.CreateAsync(model);

                var lastItem = all.TakeLast(1).ToList();

                relatorioDiario.Id = lastItem[0].Id + 1;

                return relatorioDiario;

            }

            catch
            {
                throw;
            }
        }

        public async Task<RelatorioDiario> UpdateAsync(RelatorioDiario model)
        {
            try
            {
                var relatorioDiario = await _relatorioDiarioRepository.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();

                await _relatorioDiarioRepository.UpdateAsync(relatorioDiario);

                return relatorioDiario;

            }
            catch
            {
                throw;
            }
        }
        public async Task DeleteAsync(int id)
        {
            try
            {

                await _relatorioDiarioRepository.DeleteAsync(id);
            }
            catch
            {
                throw;
            }

        }

        
    }
}

