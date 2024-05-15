using System.Security.Claims;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class ClienteService:IClienteService
    {
        private readonly IClienteRepository _clienteRepository;

        private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;

        private readonly IHttpContextAccessor _httpContextAccessor;
        public ClienteService(IClienteRepository clienteRepository,ILogAcoesUsuarioService logAcoesUsuarioService, IHttpContextAccessor httpContextAccessor)
        {
            _clienteRepository = clienteRepository;

            _logAcoesUsuarioService = logAcoesUsuarioService;

            _httpContextAccessor = httpContextAccessor;
        }
        
         public async Task<List<Cliente>> GetAllAsync()
        {
            try
            {
                return await _clienteRepository.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
         public async Task<Cliente> GetByIdAsync(int id)
        {
            try
            {
                var cliente = await _clienteRepository.GetByIdAsync(id);

                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Editando Cliente",
                    responsavel: userName);

                await _logAcoesUsuarioService.CreateAsync(log);
                return cliente;
            }
            catch
            {
                throw;
            }
        }

        public async Task<Cliente> CreateAsync(Cliente model)
        {
            try
            {
                var all = await _clienteRepository.GetAllAsync();

             

                var cliente = await _clienteRepository.CreateAsync(model);

                var lastItem = all.TakeLast(1).ToList(); 
                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Criação do Cliente {cliente.Nome}",
                    responsavel: userName);
                
                await _logAcoesUsuarioService.CreateAsync(log);

                cliente.Id = lastItem[0].Id + 1;

                return cliente;

            }

            catch
            {
                throw;
            }
        }

        public async Task<Cliente> UpdateAsync(Cliente model)
        {
            try
            {
                var cliente =  await _clienteRepository.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();

                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização do Cliente de Codigo Interno Nº {model.Id}",
                    responsavel: userName);
                
                await _logAcoesUsuarioService.CreateAsync(log);
                
                await _clienteRepository.UpdateAsync(model);

                return cliente;

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

            await _clienteRepository.DeleteAsync(id);
            }
            catch
            {
                throw;
            }

        }

      

       
    }
}
