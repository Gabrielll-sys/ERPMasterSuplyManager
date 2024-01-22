using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class MaterialService:IMaterialService
    {
        private readonly IMaterialRepository _materialRepository;

        public MaterialService(IMaterialRepository materialRepository)
        {
            _materialRepository = materialRepository;
        }
         public async Task<List<Material>> GetAllMateriaisAsync()
        {
            try
            {
                return await _materialRepository.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
         public async Task<Material> GetByIdAsync(int id)
        {
            try
            {
                return await _materialRepository.GetByIdAsync(id);
            }
            catch
            {
                throw;
            }
        }

        public async Task<Material> CreateAsync(Material model)
        {
            try
            {
                var all = await _materialRepository.GetAllAsync();
                var material = await _materialRepository.CreateAsync(model);
                material.Id = all.Count + 1;
                return material;

            }

            catch
            {
                throw;
            }
        }

        public async Task<Material> UpdateAsync(Material model)
        {
            try
            {
                _ = _materialRepository.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();

                var material = await _materialRepository.UpdateAsync(model);

                return material;

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

            await _materialRepository.DeleteAsync(id);
            }
            catch
            {
                throw;
            }

        }

      

       
    }
}
