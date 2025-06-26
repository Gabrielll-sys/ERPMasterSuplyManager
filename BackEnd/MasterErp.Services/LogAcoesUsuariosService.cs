
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;

namespace MasterErp.Services;

public class LogAcoesUsuarioService: ILogAcoesUsuarioService, IScopedService
{
        private readonly ILogAcoesUsuarioRepository _logAcoesUsuarioRepository;

        public LogAcoesUsuarioService(ILogAcoesUsuarioRepository logAcoesUsuarioRepository)
        {
            _logAcoesUsuarioRepository = logAcoesUsuarioRepository;
        }
        
         public async Task<List<LogAcoesUsuario>> GetAllAsync()
        {
            try
            {
                return await _logAcoesUsuarioRepository.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
         public async Task<LogAcoesUsuario> GetByIdAsync(int id)
        {
            try
            {
                return await _logAcoesUsuarioRepository.GetByIdAsync(id);
            }
            catch
            {
                throw;
            }
        }

        public async Task<LogAcoesUsuario> CreateAsync(LogAcoesUsuario model)
        {
            try
            {
                var all = await _logAcoesUsuarioRepository.GetAllAsync();

                LogAcoesUsuario m1 = new LogAcoesUsuario(acao:model.Acao,responsavel:model.Responsavel);

                var log = await _logAcoesUsuarioRepository.CreateAsync(m1);

                var lastItem = all.TakeLast(1).ToList(); 
                
                log.Id = lastItem[0].Id + 1;

                return log;

            }

            catch
            {
                throw;
            }
        }

        public async Task<List<LogAcoesUsuario>> GetByLogByDateInterval(DateTime date)
        {

            var allLogs = await _logAcoesUsuarioRepository.GetAllAsync();
            
            return  allLogs.Where(x => x.DataAcao == date).OrderBy(x => x.DataAcao).ToList();

        }
}
    