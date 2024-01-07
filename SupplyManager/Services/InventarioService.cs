using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class InventarioService : IInventarioService
    {
        private readonly InventarioRepository _inventarioRepository;

        public InventarioService(InventarioRepository inventarioRepository) 
        {
            _inventarioRepository = inventarioRepository;
        }


        public async Task<List<Inventario>> GetAllInventarioAsync()
        {
            try
            {
                return await _inventarioRepository.GetAllAsync();               

            }
            catch (Exception)
            {
                throw;
            }


        }

        public Task<Inventario> GetByIdAsync(int id)
        {
            try
            {

            }
            catch (Exception)
            {

            }
        }

        public Task<Inventario> GetLastRegister(int id)
        {

            try
            {

            }
            catch (Exception)
            {

            }
        }
        public Task<Inventario> CreateAsync(Inventario model)
        {
            try
            {

            }
            catch (Exception)
            {

            }
        }

       

        public Task<Inventario> GetByCodigoFabricante(string codigoFabricante)
        {
            try
            {

            }
            catch (Exception)
            {

            }
        }

        public Task<Inventario> GetByDescricao(string descricao)
        {
            try
            {

            }
            catch (Exception)
            {

            }
        }


      
        public Task<Inventario> UpdateAsync(Inventario model)
        {
            try
            {

            }
            catch (Exception)
            {

            }
        }
    }
}
