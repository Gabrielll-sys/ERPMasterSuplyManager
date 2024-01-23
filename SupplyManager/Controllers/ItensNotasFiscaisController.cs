using Microsoft.AspNetCore.Mvc;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using System.Net;

namespace SupplyManager.Controllers
{
    ///<summary>
    ///Controlador para gerenciar os Itens da Nota Fiscal
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ItensNotasFiscaisController:ControllerBase
    {
        private readonly IItemNotaFiscalService _itensNotasFiscaisService;

        public ItensNotasFiscaisController(IItemNotaFiscalService itemNotaFiscalService)
        {
            _itensNotasFiscaisService = itemNotaFiscalService;
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<List<ItemNotaFiscal>>> GetById(int id)
        {
            try
            {
                return await _itensNotasFiscaisService.GetAllAsync();
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

        public async Task<ActionResult<ItemNotaFiscal>> Post([FromBody] ItemNotaFiscal model)
        {
            try
            {
                ItemNotaFiscal n1 = new ItemNotaFiscal()
                {
                    AliquotaICMS = model.AliquotaICMS,
                    AliquotaIPI = model.AliquotaIPI,
                    FornecedorId = model.FornecedorId,
                    MaterialId = model.MaterialId,
                    Quantidade = model.Quantidade,
                    ValorUnitario = model.ValorUnitario,
                    

                };

                var itemNotaFiscal = await _itensNotasFiscaisService.CreateAsync(n1);

                return Ok(itemNotaFiscal);


            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        [HttpPut]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult> Put([FromBody] ItemNotaFiscal model, [FromRoute] int id)
        {
            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                await _itensNotasFiscaisService.UpdateAsync(model);
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
                await _itensNotasFiscaisService.DeleteAsync(id);
                return Ok();

            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }


    }
}
