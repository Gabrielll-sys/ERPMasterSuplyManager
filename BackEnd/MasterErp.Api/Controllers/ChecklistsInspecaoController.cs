using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using System.Net;

namespace MasterErp.Api.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class ChecklistsInspecaoController : ControllerBase
{
    private readonly IChecklistInspecaoService _service;
    private readonly IChecklistInspecaoPdfService _pdfService;

    // Injeta servicos de checklist e PDF.
    public ChecklistsInspecaoController(IChecklistInspecaoService service, IChecklistInspecaoPdfService pdfService)
    {
        _service = service;
        _pdfService = pdfService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            // Retorna historico de checklists.
            var items = await _service.GetAllAsync();
            return Ok(items);
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            // Retorna um checklist por id.
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound("Checklist nao encontrado");
            return Ok(item);
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    [HttpGet("{id}/pdf")]
    [Authorize(Roles = "Administrador,Diretor,SuporteTecnico,SuporteTÃ©cnico")]
    public async Task<IActionResult> GetPdf(int id)
    {
        try
        {
            // Gera PDF do checklist.
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound("Checklist nao encontrado");

            var pdfBytes = await _pdfService.GenerateAsync(item);
            return File(pdfBytes, "application/pdf", $"checklist-inspecao-{id}.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    [HttpPost]
    [Authorize(Roles = "Administrador,Diretor,SuporteTecnico,SuporteTÃ©cnico")]
    public async Task<IActionResult> Create([FromBody] ChecklistInspecao model)
    {
        try
        {
            // Valida JSON e cria registro.
            if (string.IsNullOrWhiteSpace(model.ConteudoJson))
                return BadRequest("Conteudo do checklist e obrigatorio");

            var created = await _service.CreateAsync(model);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador,Diretor,SuporteTecnico,SuporteTÃ©cnico")]
    public async Task<IActionResult> Update(int id, [FromBody] ChecklistInspecao model)
    {
        try
        {
            // Atualiza registro existente.
            if (id != model.Id)
                return BadRequest("ID da URL nao corresponde ao ID do modelo");

            var updated = await _service.UpdateAsync(model);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Checklist nao encontrado");
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador,Diretor,SuporteTecnico,SuporteTÃ©cnico")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            // Remove registro do historico.
            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Checklist nao encontrado");
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }
}
