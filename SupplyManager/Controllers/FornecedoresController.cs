using Microsoft.AspNetCore.Mvc;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using System.Net;

namespace SupplyManager.Controllers
{
    ///<summary>
    ///Controlador para gerenciar os Fornecedores
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class FornecedoresController:ControllerBase
    {
        private readonly IFornecedorService _fornecedoresService;

        public FornecedoresController(IFornecedorService fornecedoresService)
        {
            _fornecedoresService = fornecedoresService;
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<List<Fornecedor>>> GetById(int id)
        {
            try
            {
                return await _fornecedoresService.GetAllAsync();
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

        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<Fornecedor>> Put([FromBody] Fornecedor model)
        {
            try
            {
                Fornecedor n1 = new Fornecedor()
                {
                    Nome = model.Nome,
                    Endereco = model.Endereco,
                    Bairro = model.Bairro,
                    Cep = model.Cep,
                    Cidade = model.Cidade,
                    Estado = model.Estado,
                    Numero = model.Numero,
                    Telefone = model.Telefone,

                };

                var fornecedor = await _fornecedoresService.CreateAsync(n1);

                return Ok(fornecedor);


            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult> Put([FromBody] Fornecedor model, [FromRoute] int id)
        {
            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var a = await _fornecedoresService.UpdateAsync(model);
                return Ok();

            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        [HttpDelete]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult> Delete(int id)
        {

            try
            {
                await _fornecedoresService.DeleteAsync(id);
                return Ok();

            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

    }
}
