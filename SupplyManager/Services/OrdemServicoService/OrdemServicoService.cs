using System.Security.Claims;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class OrdemServicoService: IOrdemServicoService
    {
        private readonly IOrdemServicoRepository _ordemServicoRepository;

        private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;

        private readonly IHttpContextAccessor _httpContextAccessor;
        public OrdemServicoService(IOrdemServicoRepository ordemServicoRepository,ILogAcoesUsuarioService logAcoesUsuarioService, IHttpContextAccessor httpContextAccessor)
        {
            _ordemServicoRepository = ordemServicoRepository;

            _logAcoesUsuarioService = logAcoesUsuarioService;

            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<OrdemServico>> GetAllAsync()
        {
            try
            {
                return await _ordemServicoRepository.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
        public async Task<OrdemServico> GetByIdAsync(int? id)
        {
            try
            {
                return await _ordemServicoRepository.GetByIdAsync(id);
            }
            catch
            {
                throw;
            }
        }
        
       

        
        public async Task<OrdemServico> CreateAsync(OrdemServico model)
        {
            try
            {
                var all = await _ordemServicoRepository.GetAllAsync();


                var ordemServico = await _ordemServicoRepository.CreateAsync(model);

                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Criação de OS Nº{ordemServico.Id} do {ordemServico.Descricao}",
                    responsavel: userName);
                
                await _logAcoesUsuarioService.CreateAsync(log);
                
                var lastItem = all.TakeLast(1).ToList();

                ordemServico.Id = lastItem[0].Id + 1;

                return ordemServico;

            }

            catch
            {
                throw;
            }
        }

        public async Task<OrdemServico> UpdateAsync(OrdemServico model)
        {
            try
            {
                var material = await _ordemServicoRepository.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();

                await _ordemServicoRepository.UpdateAsync(material);

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

                await _ordemServicoRepository.DeleteAsync(id);
            }
            catch
            {
                throw;
            }

        }




    }
}
