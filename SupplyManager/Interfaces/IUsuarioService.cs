using SupplyManager.Models;

namespace SupplyManager.Interfaces
{
    public interface IUsuarioService
    {
        Task<Usuario> GetByIdAsync(int? id);


        Task<List<Usuario>> GetAllAsync();

        Task<Usuario> CreateAsync(Usuario model);

        Task<Usuario> UpdateAsync(Usuario model);


        Task<bool> ExistsAsync(string email);

        Task DeleteAsync(int id);

        Task Authenticate(AuthenticateDto model);
    }
}
