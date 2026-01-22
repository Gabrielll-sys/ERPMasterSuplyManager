using System.Security.Claims;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using Microsoft.AspNetCore.Http;

namespace MasterErp.Services;

public class SolicitacaoServicoService : ISolicitacaoServicoService, IScopedService
{
    private readonly ISolicitacaoServicoRepository _repository;
    private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SolicitacaoServicoService(
        ISolicitacaoServicoRepository repository,
        ILogAcoesUsuarioService logAcoesUsuarioService,
        IHttpContextAccessor httpContextAccessor)
    {
        _repository = repository;
        _logAcoesUsuarioService = logAcoesUsuarioService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<SolicitacaoServico>> GetAllAsync()
    {
        try
        {
            return await _repository.GetAllAsync();
        }
        catch
        {
            throw;
        }
    }

    public async Task<SolicitacaoServico> GetByIdAsync(int? id)
    {
        try
        {
            return await _repository.GetByIdAsync(id);
        }
        catch
        {
            throw;
        }
    }

    public async Task<SolicitacaoServico> CreateAsync(SolicitacaoServico model)
    {
        try
        {
            var solicitacao = await _repository.CreateAsync(model);

            var userName = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Name)?.Value ?? "Sistema";

            LogAcoesUsuario log = new LogAcoesUsuario(
                acao: $"Criação de Solicitação de Serviço Nº{solicitacao.Id} - Cliente: {solicitacao.NomeCliente}",
                responsavel: userName);

            await _logAcoesUsuarioService.CreateAsync(log);

            return solicitacao;
        }
        catch
        {
            throw;
        }
    }

    public async Task<SolicitacaoServico> UpdateAsync(SolicitacaoServico model)
    {
        try
        {
            var solicitacao = await _repository.GetByIdAsync(model.Id)
                ?? throw new KeyNotFoundException();

            await _repository.UpdateAsync(model);

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
            await _repository.DeleteAsync(id);
        }
        catch
        {
            throw;
        }
    }

    public async Task<SolicitacaoServico> AceitarAsync(int id)
    {
        try
        {
            var solicitacao = await _repository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException("Solicitação não encontrada");

            if (solicitacao.Status != 0)
                throw new InvalidOperationException("Esta solicitação já foi aceita ou concluída");

            // Obtém o nome do usuário logado
            var userName = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Name)?.Value
                ?? throw new UnauthorizedAccessException("Usuário não autenticado");

            solicitacao.Aceitar(userName);
            await _repository.UpdateAsync(solicitacao);

            LogAcoesUsuario log = new LogAcoesUsuario(
                acao: $"Aceite da Solicitação de Serviço Nº{solicitacao.Id}",
                responsavel: userName);

            await _logAcoesUsuarioService.CreateAsync(log);

            return solicitacao;
        }
        catch
        {
            throw;
        }
    }

    public async Task<SolicitacaoServico> ConcluirAsync(int id, List<string> usuarios)
    {
        try
        {
            var solicitacao = await _repository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException("Solicitação não encontrada");

            if (solicitacao.Status == 0)
                throw new InvalidOperationException("Esta solicitação ainda não foi aceita");

            if (solicitacao.Status == 2)
                throw new InvalidOperationException("Esta solicitação já foi concluída");

            if (usuarios == null || usuarios.Count == 0)
                throw new ArgumentException("É necessário informar pelo menos um usuário responsável pela conclusão");

            solicitacao.Concluir(usuarios);
            await _repository.UpdateAsync(solicitacao);

            var userName = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Name)?.Value ?? "Sistema";

            LogAcoesUsuario log = new LogAcoesUsuario(
                acao: $"Conclusão da Solicitação de Serviço Nº{solicitacao.Id} - Responsáveis: {string.Join(", ", usuarios)}",
                responsavel: userName);

            await _logAcoesUsuarioService.CreateAsync(log);

            return solicitacao;
        }
        catch
        {
            throw;
        }
    }
}
