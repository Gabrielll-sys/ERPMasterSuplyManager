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

        public async Task<Inventario> GetLastRegister(int id)
        {

            try
            {
                var i1 = await _inventarioRepository.GetAllAsync();

                var lastRegister = i1.Where(x => x.MaterialId == id).OrderBy(x=>x.Id).Last();

                return lastRegister;


           
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
                var i1 = await _inventarioRepository.GetAllAsync();

                var invetory = i1.Where(x => x.MaterialId == model.MaterialId).OrderBy(x => x.Id).ToList();

                if(invetory.Count is 1 or invetory.Count is 1)
                {



                }


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
