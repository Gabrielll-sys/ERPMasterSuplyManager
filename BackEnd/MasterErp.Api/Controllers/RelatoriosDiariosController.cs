using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;

namespace MasterErp.Api.Controllers;
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]

public class RelatoriosDiariosController:ControllerBase
{
    private readonly IRelatorioDiarioService _relatorioDiarioService;
    
    public RelatoriosDiariosController( IRelatorioDiarioService relatorioDiarioService)
    {
        _relatorioDiarioService = relatorioDiarioService;
    }
    
    
    [HttpGet]
    public async Task<ActionResult<List<RelatorioDiario>>> GetAll()
    {
       
        return Ok(await _relatorioDiarioService.GetAllAsync());


    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<RelatorioDiario>> Get(int id)
    {
        try
        {
            return Ok(await _relatorioDiarioService.GetByIdAsync(id));

        }
        catch (KeyNotFoundException)
        {
            return StatusCode(StatusCodes.Status400BadRequest);
        }
        catch (Exception exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
        }
    } 
    
    [HttpGet("buscaClienteEmpresa")]
    public async Task<ActionResult<RelatorioDiario>> BuscaCliente(string cliente)
    {
        try
        {
            return Ok(await _relatorioDiarioService.SearchClient(cliente));

        }
        catch (KeyNotFoundException)
        {
            return StatusCode(StatusCodes.Status400BadRequest);
        }
        catch (Exception exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
        }
    }

    
     /// <summary>
        /// Cria um relatório diário
        /// </summary>
        /// <param name="Relatório Diário"></param>
        /// <returns>O Relatorio Diario Criado </returns>
        /// 
        [HttpPost]
        public async Task<ActionResult<RelatorioDiario>> Post()
        {
            try
            {
                
                var rd = await _relatorioDiarioService.CreateAsync();
                

                return Ok(rd);

            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }

        }

        /// <summary>
        /// Atualiza um Relatório Diario
        /// </summary>
        /// <param name="Relatorio Diário"></param>
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] RelatorioDiario model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var rd = await _relatorioDiarioService.UpdateAsync(model);

                return Ok(rd);


            }
        
            catch (KeyNotFoundException)
            {
                return StatusCode(StatusCodes.Status404NotFound);

            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }
        }
        /// <summary>
        /// Fecha um Relatório Diário
        /// </summary>
        /// <param name="Id"></param>
        [HttpPut("finishRd/{id}")]
        public async Task<ActionResult> FinishRd([FromRoute] int id)
        {

            
            try
            {
                var rd = await _relatorioDiarioService.UpdateCloseRelatorio(id);

                return Ok(rd);


            }

            catch (KeyNotFoundException)
            {
                return StatusCode(StatusCodes.Status404NotFound);

            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }
        }
        
    
    
}