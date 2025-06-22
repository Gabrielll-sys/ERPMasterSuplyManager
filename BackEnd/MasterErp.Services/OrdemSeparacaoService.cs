using System.Security.Claims;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using Microsoft.AspNetCore.Http;
namespace MasterErp.Services
{
    public class OrdemSeparacaoService: IOrdemSeparacaoService
    {
        private readonly IOrdemSeparacaoRepository _ordemSeparacaoRepository;

        private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;

        private readonly IHttpContextAccessor _httpContextAccessor;
        public OrdemSeparacaoService(IOrdemSeparacaoRepository ordemSeparacaoRepository,ILogAcoesUsuarioService logAcoesUsuarioService, IHttpContextAccessor httpContextAccessor)
        {
            _ordemSeparacaoRepository = ordemSeparacaoRepository;

            _logAcoesUsuarioService = logAcoesUsuarioService;

            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<OrdemSeparacao>> GetAllAsync()
        {
            try
            {
                return await _ordemSeparacaoRepository.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
        public async Task<OrdemSeparacao> GetByIdAsync(int? id)
        {
            try
            {
                return await _ordemSeparacaoRepository.GetByIdAsync(id);
            }
            catch
            {
                throw;
            }
        }
        
       

        
        public async Task<OrdemSeparacao> CreateAsync(OrdemSeparacao model)
        {
            try
            {
                var all = await _ordemSeparacaoRepository.GetAllAsync();


                var ordemSeparacao = await _ordemSeparacaoRepository.CreateAsync(model);

                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Criação de OS Nº{ordemSeparacao.Id} do {ordemSeparacao.Descricao}",
                    responsavel: userName);
                
                await _logAcoesUsuarioService.CreateAsync(log);
                
                var lastItem = all.TakeLast(1).ToList();

                ordemSeparacao.Id = lastItem[0].Id + 1;

                return ordemSeparacao;

            }

            catch
            {
                throw;
            }
        }

        public async Task<OrdemSeparacao> UpdateAsync(OrdemSeparacao model)
        {
            try
            {
                var material = await _ordemSeparacaoRepository.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();

                await _ordemSeparacaoRepository.UpdateAsync(material);

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

                await _ordemSeparacaoRepository.DeleteAsync(id);
            }
            catch
            {
                throw;
            }

        }




    }
}
