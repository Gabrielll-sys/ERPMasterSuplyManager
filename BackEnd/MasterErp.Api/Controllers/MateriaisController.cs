using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FluentValidation.Results;
using System.Net;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using MasterErp.Domain.Validations.MateriaisValidations;
using MasterErp.Api.ViewModels;
using MasterErp.Api.Extensions;
using MasterErp.Infraestructure.Context;

namespace MasterErp.Api.Controllers;

/// <summary>
/// Controlador para gerenciar os Materiais
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class MateriaisController : ControllerBase
{
    private readonly SqlContext _context;
    private readonly IMaterialService _materialService;
    private readonly ILogger<MateriaisController> _logger;

    public MateriaisController(
        SqlContext context,
        IMaterialService materialService,
        ILogger<MateriaisController> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _materialService = materialService ?? throw new ArgumentNullException(nameof(materialService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Busca todos os materiais
    /// </summary>
    /// <returns>Lista de todos os materiais</returns>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<Material>), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.Forbidden)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    public async Task<ActionResult<List<Material>>> GetAll()
    {
        try
        {
            _logger.LogInformation("Iniciando busca de todos os materiais");
            var materiais = await _materialService.GetAllAsync();
            _logger.LogInformation("Busca de materiais concluída com sucesso. Total: {Count}", materiais.Count);
            return Ok(materiais);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar todos os materiais");
            return StatusCode((int)HttpStatusCode.InternalServerError, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Obtém material por ID
    /// </summary>
    /// <param name="id">ID do material para ser obtido</param>
    /// <returns>Material encontrado</returns>
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(Material), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    public async Task<ActionResult<Material>> GetMaterial(int id)
    {
        if (id <= 0)
        {
            _logger.LogWarning("ID inválido fornecido: {Id}", id);
            return BadRequest("ID deve ser maior que zero");
        }

        try
        {
            _logger.LogInformation("Buscando material com ID: {Id}", id);
            var material = await _materialService.GetByIdAsync(id);
            return Ok(material);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning("Material não encontrado. ID: {Id}", id);
            return NotFound($"Material com ID {id} não encontrado");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar material com ID: {Id}", id);
            return StatusCode((int)HttpStatusCode.InternalServerError, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Obtém material com o último registro de seu inventário
    /// </summary>
    /// <param name="id">ID do material</param>
    /// <returns>Material e inventário encontrado</returns>
    [HttpGet("getMaterialWithInventory/{id:int}")]
    [ProducesResponseType(typeof(Inventario), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    public async Task<ActionResult<Inventario>> GetMaterialWithInventory(int id)
    {
        if (id <= 0)
        {
            _logger.LogWarning("ID inválido fornecido: {Id}", id);
            return BadRequest("ID deve ser maior que zero");
        }

        try
        {
            _logger.LogInformation("Buscando material com inventário. ID: {Id}", id);

            var ultimoInventario = await _context.Inventarios
                .Include(s => s.Material)
                .Where(x => x.MaterialId == id)
                .OrderByDescending(x => x.Id) // Assumindo que há uma propriedade Id ou DataCriacao
                .FirstOrDefaultAsync();

            if (ultimoInventario == null)
            {
                _logger.LogWarning("Inventário não encontrado para material ID: {Id}", id);
                return NotFound($"Inventário não encontrado para o material com ID {id}");
            }

            return Ok(ultimoInventario);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar material com inventário. ID: {Id}", id);
            return StatusCode((int)HttpStatusCode.InternalServerError, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Criar novo material
    /// </summary>
    /// <param name="dto">Objeto material para ser criado</param>
    /// <returns>Material criado</returns>
    [HttpPost]
    [ProducesResponseType(typeof(Material), (int)HttpStatusCode.Created)]
    [ProducesResponseType(typeof(ValidationErrorResponse), (int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.InternalServerError)]
    public async Task<ActionResult<Material>> CreateMaterial([FromBody] MaterialDto dto)
    {
        if (dto == null)
        {
            _logger.LogWarning("DTO nulo fornecido para criação de material");
            return BadRequest("Dados do material são obrigatórios");
        }

        try
        {
            _logger.LogInformation("Iniciando criação de material");

            // Verifica se código do fabricante já existe (quando não for vazio)
            if (!string.IsNullOrWhiteSpace(dto.CodigoFabricante))
            {
                var existeCodigoFabricante = await _context.Materiais
                    .AnyAsync(x => x.CodigoFabricante == dto.CodigoFabricante);

                if (existeCodigoFabricante)
                {
                    _logger.LogWarning("Tentativa de criar material com código de fabricante duplicado: {CodigoFabricante}", dto.CodigoFabricante);
                    return BadRequest("Código de fabricante já existe");
                }
            }

            var material = new Material(
                dto.CodigoInterno,
                dto.CodigoFabricante,
                dto.Descricao,
                dto.Categoria,
                dto.Marca,
                dto.Corrente,
                dto.Unidade,
                dto.Tensao,
                dto.Localizacao,
                dto.DataEntradaNF,
                dto.PrecoCusto,
                dto.Markup
            );

            // Validação
            var validationRules = new MaterialPostValidator();
            var validationResult = validationRules.Validate(material);

            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Falha na validação do material: {Errors}",
                    string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
                return BadRequest(validationResult.ToValidationErrorReponse());
            }

            var materialCriado = await _materialService.CreateAsync(material);
            _logger.LogInformation("Material criado com sucesso. ID: {Id}", materialCriado.Id);

            return CreatedAtAction(nameof(GetMaterial), new { id = materialCriado.Id }, materialCriado);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar material");
            return StatusCode((int)HttpStatusCode.InternalServerError, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Atualizar o Material pelo ID
    /// </summary>
    /// <param name="id">O ID do material a ser atualizado</param>
    /// <param name="model">O objeto material a ser atualizado</param>
    /// <returns>O material atualizado</returns>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Material), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    public async Task<ActionResult<Material>> PutMaterial([FromRoute] int id, [FromBody] Material model)
    {
        if (id <= 0)
        {
            _logger.LogWarning("ID inválido fornecido: {Id}", id);
            return BadRequest("ID deve ser maior que zero");
        }

        if (model == null)
        {
            _logger.LogWarning("Modelo nulo fornecido para atualização");
            return BadRequest("Dados do material são obrigatórios");
        }

        if (id != model.Id)
        {
            _logger.LogWarning("ID da rota ({RouteId}) não corresponde ao ID do modelo ({ModelId})", id, model.Id);
            return BadRequest("ID da rota não corresponde ao ID do material");
        }

        try
        {
            _logger.LogInformation("Atualizando material com ID: {Id}", id);
            var materialAtualizado = await _materialService.UpdateAsync(model);
            _logger.LogInformation("Material atualizado com sucesso. ID: {Id}", id);

            return Ok(materialAtualizado);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning("Material não encontrado para atualização. ID: {Id}", id);
            return NotFound($"Material com ID {id} não encontrado");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar material com ID: {Id}", id);
            return StatusCode((int)HttpStatusCode.InternalServerError, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Deleta o material pelo ID fornecido
    /// </summary>
    /// <param name="id">O ID do material a ser deletado</param>
    /// <returns>Resultado da operação</returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    public async Task<ActionResult> Delete(int id)
    {
        if (id <= 0)
        {
            _logger.LogWarning("ID inválido fornecido para exclusão: {Id}", id);
            return BadRequest("ID deve ser maior que zero");
        }

        try
        {
            _logger.LogInformation("Deletando material com ID: {Id}", id);
            await _materialService.DeleteAsync(id);
            _logger.LogInformation("Material deletado com sucesso. ID: {Id}", id);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning("Material não encontrado para exclusão. ID: {Id}", id);
            return NotFound($"Material com ID {id} não encontrado");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar material com ID: {Id}", id);
            return StatusCode((int)HttpStatusCode.InternalServerError, "Erro interno do servidor");
        }
    }
}