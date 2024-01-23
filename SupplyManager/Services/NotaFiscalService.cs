using SupplyManager.Interfaces;
using SupplyManager.Models;

namespace SupplyManager.Services
{
    public class NotaFiscalService : INotaFiscalService
    {
        private readonly INotaFiscalRepository _notaFiscalRepository;

        public NotaFiscalService(INotaFiscalRepository notaFiscalRepository)
        {
            _notaFiscalRepository = notaFiscalRepository;
        }

        public async Task<NotaFiscal> CreateAsync(NotaFiscal model)
        {
            try
            {
                var all = await _notaFiscalRepository.GetAllAsync();

                await _notaFiscalRepository.CreateAsync(model);

                model.Id = all.Count + 1;

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
                await _notaFiscalRepository.DeleteAsync(id);

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<NotaFiscal>> GetAllAsync()
        {
            try
            {
                return await _notaFiscalRepository.GetAllAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<NotaFiscal> GetByIdAsync(int id)
        {
            try
            {
                return await _notaFiscalRepository.GetByIdAsync(id);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<NotaFiscal> UpdateAsync(NotaFiscal model)
        {
            try
            {
                await _notaFiscalRepository.UpdateAsync(model);

                return model;            
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}
