using System.Security.Claims;
using SupplyManager.Models;

namespace SupplyManager.Services;

public class OrcamentoService : IOrcamentoService
{
        private readonly IOrcamentoService _orcamentoRepository;

        private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;

        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public OrcamentoService(IOrcamentoService orcamentoRepository,ILogAcoesUsuarioService logAcoesUsuarioService, IHttpContextAccessor httpContextAccessor)
        {
            _orcamentoRepository = orcamentoRepository;

            _logAcoesUsuarioService = logAcoesUsuarioService;

            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<Orcamento>> GetAllAsync()
        {
            try
            {
                return await _orcamentoRepository.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
        public async Task<Orcamento> GetByIdAsync(int? id)
        {
            try
            {
                return await _orcamentoRepository.GetByIdAsync(id);
            }
            catch
            {
                throw;
            }
        }


        public  async Task<List<Orcamento>> GetByClientName(string name)
        {
            
            var orcamentos = await _orcamentoRepository.GetAllAsync();
            
            return orcamentos
                .Where(x => x.NomeCliente.Contains(name))
                .OrderBy(x => x.DataOrcamento)
                .ToList();
        }

        public async Task<Orcamento> GetClient(string name)
        {
            var orcamentos = await _orcamentoRepository.GetAllAsync();
                
            var clientFinded =  orcamentos
                .Where(x => x.NomeCliente.Equals(name)).ToList();

            return clientFinded[0];
        }

        public async Task<Orcamento> CreateAsync(Orcamento model)
        {
            try
            {
                var all = await _orcamentoRepository.GetAllAsync();


                var ordemServico = await _orcamentoRepository.CreateAsync(model);

                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Criação do Orcamento Nº{ordemServico.Id} de {ordemServico.NomeCliente}",
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

        public async Task<Orcamento> UpdateAsync(Orcamento model)
        {
            try
            {
                var orcamento = await _orcamentoRepository.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();

                await _orcamentoRepository.UpdateAsync(orcamento);

                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                LogAcoesUsuario log = new LogAcoesUsuario();
                
                log.Responsavel = userName;
                
                if (model.NomeCliente != orcamento.NomeCliente)
                {
                    log.Acao = $"Mundança do nome do cliente de {orcamento.NomeCliente} para {model.NomeCliente}";
                    
                }
                else if (model.Observacoes != orcamento.Observacoes)
                {
                    log.Acao = $"Mundança das observações de {orcamento.Observacoes} para {model.Observacoes}";

                } 
                else if (model.Endereco != orcamento.Endereco)
                {                                                                                    
                    log.Acao = $"Mundança do endereço do cliente de {orcamento.Endereco} para {model.Endereco}";

                }
               
                
                await _logAcoesUsuarioService.CreateAsync(log);
                
                return orcamento;

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

                await _orcamentoRepository.DeleteAsync(id);
            }
            catch
            {
                throw;
            }

        }

}