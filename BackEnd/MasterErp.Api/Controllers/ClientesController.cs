using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
namespace MasterErp.Api.Controllers;

    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ClientesController : ControllerBase
    {

        public readonly IClienteService _clientesService;

        public ClientesController(IClienteService clienteService)
        {
            _clientesService = clienteService;


        }

        [HttpGet]
        public async Task<ActionResult<List<Cliente>>> GetAll()
        {

            return Ok(await _clientesService.GetAllAsync());


        }
       

        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> Get(int id)
        {
            try
            {
                return Ok(await _clientesService.GetByIdAsync(id));

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
        public async Task<ActionResult> Post([FromBody] Cliente model)
        {
            try
            {

                var rd = await _clientesService.CreateAsync(model);


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
        public async Task<ActionResult> Put(int id, [FromBody] Cliente model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var rd = await _clientesService.UpdateAsync(model);

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
                await _clientesService.DeleteAsync(id);
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
    

