using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class RelatorioDiarioService : IRelatorioDiarioService
    {
        private readonly IRelatorioDiarioRepository _relatorioDiarioRepository;
        
        private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;

        private readonly IHttpContextAccessor _httpContextAccessor;
        public RelatorioDiarioService(IRelatorioDiarioRepository relatorioDiarioRepository,ILogAcoesUsuarioService logAcoesUsuarioService, IHttpContextAccessor httpContextAccessor)
        {
            _relatorioDiarioRepository = relatorioDiarioRepository;
            _logAcoesUsuarioService = logAcoesUsuarioService;

            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<List<RelatorioDiario>> GetAllAsync()
        {
            try
            {
                return await _relatorioDiarioRepository.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
        public async Task<RelatorioDiario> GetByIdAsync(int? id)
        {
            try
            {
                return await _relatorioDiarioRepository.GetByIdAsync(id);
            }
            catch
            {
                throw;
            }
        }
        
        
        public async Task<RelatorioDiario> CreateAsync()
        {
            try
            {
                var all = await _relatorioDiarioRepository.GetAllAsync();

                var lastItem = all.TakeLast(1).ToList(); 
                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                RelatorioDiario r1 = new RelatorioDiario(userName);
                
                var relatorioDiario = await _relatorioDiarioRepository.CreateAsync(r1);
                
                relatorioDiario.Id = lastItem[0].Id + 1;
                
                
                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Criação do Relatório Diário Nº {relatorioDiario.Id}",
                    responsavel: userName);
                
                await _logAcoesUsuarioService.CreateAsync(log);
             

                return relatorioDiario;

            }

            catch
            {
                throw;
            }
        }

        public async Task<RelatorioDiario> UpdateAsync(RelatorioDiario model)
        {
            try
            {
                var rd = await _relatorioDiarioRepository.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();
                
                rd.Contato = model.Contato;
                
                await _relatorioDiarioRepository.UpdateAsync(rd);

                return model;

            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Define a proprieadade de autorizado com true
        /// </summary>
        /// <param name="id">Id do Relatório a ser Fechado/Autorizado</param>
        public async Task<RelatorioDiario> UpdateCloseRelatorio(int id)
        {
            try
            {
                var relatorioDiario = await _relatorioDiarioRepository.GetByIdAsync(id) ?? throw new KeyNotFoundException();
                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                relatorioDiario.FecharRelatorio( responsavelFechamento: userName);
                
                await _relatorioDiarioRepository.UpdateAsync(relatorioDiario);

                return relatorioDiario;

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

                await _relatorioDiarioRepository.DeleteAsync(id);
            }
            catch
            {
                throw;
            }

        }

        
    }
}

