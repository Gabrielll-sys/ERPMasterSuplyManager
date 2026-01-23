using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using System.Net;

namespace MasterErp.Api.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class AprsController : ControllerBase
{
    private readonly IAprService _service;
    private readonly IAprPdfService _aprPdfService;

    public AprsController(IAprService service, IAprPdfService aprPdfService)
    {
        _service = service;
        _aprPdfService = aprPdfService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var aprs = await _service.GetAllAsync();
            return Ok(aprs);
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
            var apr = await _service.GetByIdAsync(id);
            if (apr == null) return NotFound("APR não encontrada");
            return Ok(apr);
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }


    [HttpGet("{id}/pdf")]
    [Authorize(Roles = "Administrador,Diretor,SuporteTecnico,SuporteTécnico")]
    public async Task<IActionResult> GetPdf(int id)
    {
        try
        {
            // Busca a APR e gera o PDF para download.
            var apr = await _service.GetByIdAsync(id);
            if (apr == null) return NotFound("APR não encontrada");

            var pdfBytes = await _aprPdfService.GenerateAsync(apr);
            return File(pdfBytes, "application/pdf", $"apr-{id}.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    [HttpPost]
    [Authorize(Roles = "Administrador,Diretor,SuporteTecnico,SuporteTécnico")]
    public async Task<IActionResult> Create([FromBody] Apr model)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(model.ConteudoJson))
                return BadRequest("Conteúdo da APR é obrigatório");

            var apr = await _service.CreateAsync(model);
            return CreatedAtAction(nameof(GetById), new { id = apr.Id }, apr);
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador,Diretor,SuporteTecnico,SuporteTécnico")]
    public async Task<IActionResult> Update(int id, [FromBody] Apr model)
    {
        try
        {
            if (id != model.Id)
                return BadRequest("ID da URL não corresponde ao ID do modelo");

            var apr = await _service.UpdateAsync(model);
            return Ok(apr);
        }
        catch (KeyNotFoundException)
        {
            return NotFound("APR não encontrada");
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

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
            return NotFound("APR não encontrada");
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }
}
