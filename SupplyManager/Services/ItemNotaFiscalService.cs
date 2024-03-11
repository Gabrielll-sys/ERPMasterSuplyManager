using SupplyManager.App;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class ItemNotaFiscalService : IItemNotaFiscalService
    {
        private readonly  IItemNotaFiscalRepository _itemNotaFiscalRepository;

        public ItemNotaFiscalService(IItemNotaFiscalRepository itemNotaFiscalRepository)
        {
            _itemNotaFiscalRepository = itemNotaFiscalRepository;
        }

        public async Task<ItemNotaFiscal> CreateAsync(ItemNotaFiscal model)
        {
            try
            {
               /* var all = await _itemNotaFiscalRepository.GetAllAsync();*/

                await _itemNotaFiscalRepository.CreateAsync(model);

                /*model.Id = all.Count + 1;*/

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
                await _itemNotaFiscalRepository.DeleteAsync(id);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<ItemNotaFiscal>> GetAllAsync()
        {
            try
            {
                return await _itemNotaFiscalRepository.GetAllAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ItemNotaFiscal> GetByIdAsync(int id)
        {
            try
            {
                return await _itemNotaFiscalRepository.GetByIdAsync(id);
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
                await _itemNotaFiscalRepository.UpdateAsync(model);

                return model;
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}
