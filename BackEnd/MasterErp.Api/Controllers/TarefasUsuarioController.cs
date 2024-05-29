using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using MasterErp.Services;


   namespace MasterErp.Api.Controllers;
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
    
public class TarefasUsuariosController:ControllerBase
{
    private readonly ITarefaUsuarioService _tarefaUsuarioService;
    
    public TarefasUsuariosController( ITarefaUsuarioService tarefaUsuarioService)
    {
        _tarefaUsuarioService = tarefaUsuarioService;
    }
    
    
    [HttpGet]
    public async Task<ActionResult<List<TarefaUsuario>>> GetAll()
    {
       
        return Ok(await _tarefaUsuarioService.GetAllAsync());


    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<TarefaUsuario>> Get(int id)
    {
        try
        {
            return Ok(await _tarefaUsuarioService.GetByIdAsync(id));

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
    [HttpGet("search-user-tasks")]
    public async Task<ActionResult<TarefaUsuario>> SearchUserTasks(int id)
    {
        try
        {
            return Ok(await _tarefaUsuarioService.SearchUserTasks());

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
        public async Task<ActionResult<TarefaUsuario>> Post(TarefaUsuario model)
        {
            try
            {
                
                var rd = await _tarefaUsuarioService.CreateAsync(model);
                

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
        public async Task<ActionResult> Put(int id, [FromBody] TarefaUsuario model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var rd = await _tarefaUsuarioService.UpdateAsync(model);

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
    // DELETE api/<ValuesController>/5
    [HttpDelete("{id}")]
   

    public async Task<ActionResult> Delete(int id)
    {
        try
        {

            await _tarefaUsuarioService.DeleteAsync(id);

            return Ok();

        }
        catch (Exception exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

        }


    }



}