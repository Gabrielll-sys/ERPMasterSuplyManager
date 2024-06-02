using System.Security.Claims;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using Microsoft.AspNetCore.Http;
using static System.Runtime.InteropServices.JavaScript.JSType;
namespace MasterErp.Services
{
    public class TarefaUsuarioService : ITarefaUsuarioService
    {
        private readonly ITarefaUsuarioRepository _tarefaUsuarioRepository;
        
        private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;

        private readonly IHttpContextAccessor _httpContextAccessor;
        public TarefaUsuarioService(ITarefaUsuarioRepository tarefaUsuarioRepository,ILogAcoesUsuarioService logAcoesUsuarioService, IHttpContextAccessor httpContextAccessor)
        {
            _tarefaUsuarioRepository = tarefaUsuarioRepository;
            _logAcoesUsuarioService = logAcoesUsuarioService;

            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<List<TarefaUsuario>> GetAllAsync()
        {
            try
            {
                return await _tarefaUsuarioRepository.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
        public async Task<TarefaUsuario> GetByIdAsync(int? id)
        {
            try
            {
                return await _tarefaUsuarioRepository.GetByIdAsync(id);
            }
            catch
            {
                throw;
            }
        }
        
        
        public async Task<TarefaUsuario> CreateAsync(TarefaUsuario model)
        {
            try
            {
                var all = await _tarefaUsuarioRepository.GetAllAsync();

                var lastItem = all.TakeLast(1).ToList();

                var userName = _httpContextAccessor.HttpContext.User.Claims.First(x => x.Type== ClaimTypes.Name)?.Value;
                var userId = _httpContextAccessor.HttpContext.User.Claims.First(x=>x.Type == ClaimTypes.NameIdentifier)?.Value;

                model.UsuarioId = Int32.Parse(userId) ;
                
                var tarefaUsuario = await _tarefaUsuarioRepository.CreateAsync(model);

                //tarefaUsuario.Id = lastItem[0].Id + 1;
                
                
                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Criação da Tarefa de Usuário Nº {tarefaUsuario.Id}",
                    responsavel: userName);
                
                await _logAcoesUsuarioService.CreateAsync(log);
             

                return tarefaUsuario;

            }

            catch
            {
                throw;
            }
        }

        public async Task<TarefaUsuario> UpdateAsync(TarefaUsuario model)
        {
            try
            {
                _ = await _tarefaUsuarioRepository.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();
                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

   
                await _tarefaUsuarioRepository.UpdateAsync(model);


                return model;

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

                await _tarefaUsuarioRepository.DeleteAsync(id);
            }
            catch
            {
                throw;
            }

        }
        public async Task<List<TarefaUsuario>> SearchUserTasksByDate(DateTime date)
        {

            var userId = _httpContextAccessor.HttpContext.User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier)?.Value;


            var tasks = await _tarefaUsuarioRepository.GetAllAsync();


            var userTasks = tasks.Where(x => x.UsuarioId == Int32.Parse(userId)).ToList();

            var result = userTasks.Where(x => x.DataTarefa is not null && x.DataTarefa.Value.Date == date.Date).OrderByDescending(x => x.Prioridade).ToList();


            return result;


        }
        
    }
}

