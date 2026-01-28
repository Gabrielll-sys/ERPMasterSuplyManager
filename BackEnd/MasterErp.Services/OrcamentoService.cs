using System.Security.Claims;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using MasterErp.Domain.Models.Pagination;
using Microsoft.AspNetCore.Http;
namespace MasterErp.Services;

public class OrcamentoService : IOrcamentoService, IScopedService
{
        private readonly IOrcamentoRepository _orcamentoRepository;

        private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;

        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public OrcamentoService(IOrcamentoRepository orcamentoRepository,ILogAcoesUsuarioService logAcoesUsuarioService, IHttpContextAccessor httpContextAccessor)
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

        public async Task<PagedResult<Orcamento>> GetPagedAsync(PaginationParams paginationParams)
        {
            try
            {
                return await _orcamentoRepository.GetPagedAsync(paginationParams);
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

                var lastItem = all.FirstOrDefault();

                var ordemSeparacao = await _orcamentoRepository.CreateAsync(model);

                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Criação do Orcamento Nº{lastItem.Id + 1} de {ordemSeparacao.NomeCliente}",
                    responsavel: userName);
                
                await _logAcoesUsuarioService.CreateAsync(log);
                
               

                ordemSeparacao.Id = lastItem.Id + 1;

                return ordemSeparacao;

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

                await _orcamentoRepository.UpdateAsync(model);

                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                LogAcoesUsuario log = new LogAcoesUsuario();
                
                log.Responsavel = userName;
                
                if (model.NomeCliente != orcamento.NomeCliente)
                {
                    log.Acao = $"Mudança do nome do cliente do Orcamento Nº{orcamento.Id} de {orcamento.NomeCliente} para {model.NomeCliente}";
                    
                }
                else if (model.Observacoes != orcamento.Observacoes)
                {
                    log.Acao = $"Mudança das observações do Orcamento Nº{orcamento.Id} de {orcamento.Observacoes} para {model.Observacoes}";

                } 
                else if (model.Endereco != orcamento.Endereco)
                {                                                                                    
                    log.Acao = $"Mudança do endereço do cliente do Orcamento Nº{orcamento.Id} de {orcamento.Endereco} para {model.Endereco}";

                }
                else if (model.Telefone != orcamento.Telefone)
                {                                                                                    
                    log.Acao = $"Mudança do Telefone do cliente do Orcamento Nº{orcamento.Id} de {orcamento.Telefone} para {model.Telefone}";

                }
                else if (model.TipoPagamento != orcamento.TipoPagamento)
                {                                                                                    
                    log.Acao = $"Mudança do Tipo De Pagamento  do Orcamento Nº{orcamento.Id} de {orcamento.TipoPagamento} para {model.TipoPagamento}";

                }
                else if (model.EmailCliente != orcamento.EmailCliente)
                {                                                                                    
                    log.Acao = $"Mudança do Email do cliente do Orcamento Nº{orcamento.Id} de {orcamento.EmailCliente} para {model.EmailCliente}";

                }
                else if (model.CpfOrCnpj != orcamento.CpfOrCnpj)
                {                                                                                    
                    log.Acao = $"Mudança do CPF OU CNPJ do cliente do Orcamento Nº{orcamento.Id} de {orcamento.CpfOrCnpj} para {model.CpfOrCnpj}";

                }
                else if (model.Desconto != orcamento.Desconto)
                {                                                                                    
                    log.Acao = $"Mudança de desconto do Orcamento Nº{orcamento.Id} de {orcamento.Desconto}% para {model.Desconto}%";

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