using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using System.Net;

namespace MasterErp.Api.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class SolicitacaoServicoController : ControllerBase
{
    private readonly ISolicitacaoServicoService _service;

    public SolicitacaoServicoController(ISolicitacaoServicoService service)
    {
        _service = service;
    }

    /// <summary>
    /// Busca todas as solicitações de serviço
    /// </summary>
    /// <returns>Lista de solicitações</returns>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var solicitacoes = await _service.GetAllAsync();
            return Ok(solicitacoes);
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    /// <summary>
    /// Busca uma solicitação de serviço pelo ID
    /// </summary>
    /// <param name="id">ID da solicitação</param>
    /// <returns>Solicitação encontrada</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var solicitacao = await _service.GetByIdAsync(id);
            if (solicitacao == null)
                return NotFound("Solicitação não encontrada");

            return Ok(solicitacao);
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    /// <summary>
    /// Cria uma nova solicitação de serviço
    /// </summary>
    /// <param name="model">Dados da solicitação</param>
    /// <returns>Solicitação criada</returns>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SolicitacaoServico model)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(model.Descricao))
                return BadRequest("A descrição é obrigatória");

            if (string.IsNullOrWhiteSpace(model.NomeCliente))
                return BadRequest("O nome do cliente é obrigatório");

            var solicitacao = await _service.CreateAsync(model);
            return CreatedAtAction(nameof(GetById), new { id = solicitacao.Id }, solicitacao);
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    /// <summary>
    /// Atualiza uma solicitação de serviço
    /// </summary>
    /// <param name="id">ID da solicitação</param>
    /// <param name="model">Dados atualizados</param>
    /// <returns>Solicitação atualizada</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador,Diretor,SuporteTecnico,SuporteTécnico")]
    public async Task<IActionResult> Update(int id, [FromBody] SolicitacaoServico model)
    {
        try
        {
            if (id != model.Id)
                return BadRequest("ID da URL não corresponde ao ID do modelo");

            var solicitacao = await _service.UpdateAsync(model);
            return Ok(solicitacao);
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Solicitação não encontrada");
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    /// <summary>
    /// Aceita uma solicitação de serviço (registra o usuário logado)
    /// </summary>
    /// <param name="id">ID da solicitação</param>
    /// <returns>Solicitação aceita</returns>
    [HttpPut("aceitar/{id}")]
    public async Task<IActionResult> Aceitar(int id)
    {
        try
        {
            var solicitacao = await _service.AceitarAsync(id);
            return Ok(solicitacao);
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Solicitação não encontrada");
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    /// <summary>
    /// Conclui uma solicitação de serviço (registra os usuários responsáveis)
    /// </summary>
    /// <param name="id">ID da solicitação</param>
    /// <param name="payload">Lista de usuários responsáveis pela conclusão</param>
    /// <returns>Solicitação concluída</returns>
    [HttpPut("concluir/{id}")]
    public async Task<IActionResult> Concluir(int id, [FromBody] ConcluirSolicitacaoPayload payload)
    {
        try
        {
            var solicitacao = await _service.ConcluirAsync(id, payload.Usuarios);
            return Ok(solicitacao);
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Solicitação não encontrada");
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    /// <summary>
    /// Remove uma solicitação de serviço
    /// </summary>
    /// <param name="id">ID da solicitação</param>
    /// <returns>NoContent se sucesso</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador,Diretor,SuporteTecnico,SuporteTécnico")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Solicitação não encontrada");
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }
}

/// <summary>
/// Payload para o endpoint de conclusão
/// </summary>
public class ConcluirSolicitacaoPayload
{
    public List<string> Usuarios { get; set; } = new List<string>();
}
