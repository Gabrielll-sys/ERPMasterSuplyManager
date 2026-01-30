
using Microsoft.AspNetCore.Mvc;
using MasterErp.Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using MasterErp.Domain.Models;
namespace MasterErp.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class AtividadesRdController:ControllerBase
{
    private readonly IAtividadeRdService _atividadesRdService;

  

    public AtividadesRdController(IAtividadeRdService atividadesRdService)
    {
        _atividadesRdService = atividadesRdService;
        
    }
     [HttpGet]
    public async Task<ActionResult<List<AtividadeRd>>> GetAll()
    {
       
        return Ok(await _atividadesRdService.GetAllAsync());


    }
    /// <summary>
    /// Busca todas as atividades de um Rd
    /// </summary>
    /// <returns>Uma lista de atividades de um determinado Rd</returns>
    [HttpGet("AtividadesInRd/{id}")]
    public async Task<ActionResult<List<AtividadeRd>>> GetAllInRd(int id)
    {
       
        return Ok(await _atividadesRdService.GetAllInRdAsync(id));


    }

 
    [HttpGet("{id}")]
    public async Task<ActionResult<AtividadeRd>> Get(int id)
    {
        try
        {
            return Ok(await _atividadesRdService.GetByIdAsync(id));

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
        /// <param name="Usuario"></param>
        /// <returns>O Relatorio Diario Criado </returns>
        /// 
        [HttpPost]
        /*[Authorize(Roles = "Diretor")]*/
        public async Task<ActionResult> Post([FromBody] AtividadeRd model)
        {
            try
            {
                
                var rd = await _atividadesRdService.CreateAsync(model);
       

                return Ok(rd);

            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }

        }

        /// <summary>
        /// Atualiza uma atividade
        /// </summary>
        /// <param name="Relatorio Diário"></param>
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] AtividadeRd model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var rd = await _atividadesRdService.UpdateAsync(model);

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
        /// Exclui uma Atividade
        /// </summary>
        /// <param name="Id da atividade"></param>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            
            try
            {
              await _atividadesRdService.DeleteAsync(id);
              return Ok();
                
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