using Microsoft.EntityFrameworkCore;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        public UsuarioService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }
        public async Task<List<Usuario>> GetAllAsync()
        {
            try
            {
                return await _usuarioRepository.GetAllAsync();
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
                return await _usuarioRepository.GetByIdAsync(id);
            }
            catch
            {
                throw;
            }
        }
        
           public async Task<Usuario> ExistsAsync(string email)
            {

                try
                {
                    return await _usuarioRepository.ExistsAsync(email);


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
                var all = await _usuarioRepository.GetAllAsync();


                var material = await _usuarioRepository.CreateAsync(model);

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
                var material = await _usuarioRepository.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();

                await _usuarioRepository.UpdateAsync(material);

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

                await _usuarioRepository.DeleteAsync(id);
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

