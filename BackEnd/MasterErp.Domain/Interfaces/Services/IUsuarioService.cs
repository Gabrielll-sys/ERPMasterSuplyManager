
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;

    public interface IUsuarioService
    {
        Task<Usuario> GetByIdAsync(int? id);


        Task<List<Usuario>> GetAllAsync();

        Task<Usuario> CreateAsync(Usuario model);

        Task<Usuario> UpdateAsync(Usuario model);


        Task<Usuario> ExistsAsync(string email);
        Task TurnUserInactive(int id);
        Task TurnUserActive(int id);

        Task ResetUserPassword(int id);


        Task DeleteAsync(int id);

        Task Authenticate(AuthenticateDto model);
    }

