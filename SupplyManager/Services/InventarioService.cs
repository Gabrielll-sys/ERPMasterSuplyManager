using Microsoft.EntityFrameworkCore;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;
using SupplyManager.Validations.InventarioValidations;

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

        public async Task<Inventario> GetByIdAsync(int id)
        {
            try
            {

                return await _inventarioRepository.GetByIdAsync(id) ?? throw new KeyNotFoundException();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public Task<Inventario> GetLastRegister(int id)
        {

            try
            {


                throw new NotImplementedException();
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<Inventario> CreateAsync(Inventario model)
        {
            try
            {
                throw new NotImplementedException();
            }

            catch (Exception)
            {
                throw;
            }
        }

       

        public Task<Inventario> GetByCodigoFabricante(string codigoFabricante)
        {
            try
            {
                throw new NotImplementedException();

            }
            catch (Exception)
            {
                throw;

            }
        }

        public Task<Inventario> GetByDescricao(string descricao)
        {
            try
            {
                throw new NotImplementedException();

            }
            catch (Exception)
            {
                throw;

            }
        }


      
        public Task<Inventario> UpdateAsync(Inventario model)
        {
            try
            {
                throw new NotImplementedException();

            }
            catch (Exception)
            {
                throw;

            }
        }
    }
}
