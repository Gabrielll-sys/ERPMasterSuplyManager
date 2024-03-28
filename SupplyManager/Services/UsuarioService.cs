using Microsoft.EntityFrameworkCore;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioService _usuarioService;
        public UsuarioService(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }
        public async Task<List<Usuario>> GetAllAsync()
        {
            try
            {
                return await _usuarioService.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
        public async Task<Usuario> GetByIdAsync(int? id)
        {
            try
            {
                return await _usuarioService.GetByIdAsync(id);
            }
            catch
            {
                throw;
            }
        }
        
           public async Task<bool> ExistsAsync(string email)
            {

                try
                {
                    return await _usuarioService.ExistsAsync(email);


                }
                catch (Exception)
                {
                    throw;
                }
            }

        
        public async Task<Usuario> CreateAsync(Usuario model)
        {
            try
            {
                var all = await _usuarioService.GetAllAsync();


                var material = await _usuarioService.CreateAsync(model);

                var lastItem = all.TakeLast(1).ToList();

                material.Id = lastItem[0].Id + 1;

                return material;

            }

            catch
            {
                throw;
            }
        }

        public async Task<Usuario> UpdateAsync(Usuario model)
        {
            try
            {
                var material = await _usuarioService.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();

                await _usuarioService.UpdateAsync(material);

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

                await _usuarioService.DeleteAsync(id);
            }
            catch
            {
                throw;
            }

        }


        public async Task Authenticate(AuthenticateDto model)
        {


        }




    }
}

