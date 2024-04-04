using SupplyManager.Models;

namespace SupplyManager.Interfaces
{
    public interface IUsuarioRepository
    {

        Task<Usuario> GetByIdAsync(int? id);


        Task<List<Usuario>> GetAllAsync();

        Task<Usuario> CreateAsync(Usuario model);

        Task<Usuario> UpdateAsync(Usuario inventario);

        Task<Usuario> ExistsAsync(string email);
        Task DeleteAsync(int id);
    }
}
