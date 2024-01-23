using Microsoft.AspNetCore.Mvc;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Services;
using System.Net;

namespace SupplyManager.Controllers
{

    ///<summary>
    ///Controlador para gerenciar as Notas Fiscais
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class NotasFiscaisController : ControllerBase
    {

        private readonly INotaFiscalService _notasFiscaisService;

        public NotasFiscaisController(INotaFiscalService notaFiscalService)
        {
            _notasFiscaisService = notaFiscalService;
        }


        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<List<NotaFiscal>>> GetById(int id)
        {
            try
            {
                return await _notasFiscaisService.GetAllAsync();
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

        public async Task<ActionResult<NotaFiscal>> Put([FromBody]NotaFiscal model)
        {
            try
            {
                NotaFiscal n1 = new NotaFiscal()
                {
                    BaseCalculoICMS = model.BaseCalculoICMS ?? 0,
                    ValorICMS = model.ValorICMS ?? 0,
                    Frete = model.Frete ?? 0,
                    DataEmissaoNF = model.DataEmissaoNF,
                    NumeroNF = model.NumeroNF ?? "",
                    CFOP = model.CFOP ?? "",

                };

               var notaFiscal = await _notasFiscaisService.CreateAsync(n1);

               return Ok(notaFiscal);
               

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

        public async Task<ActionResult> Put ([FromBody] NotaFiscal model, [FromRoute] int id )
        {
            if(model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                 _notasFiscaisService.UpdateAsync(model);
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

        public async Task <ActionResult> Delete(int id)
        {


            try
            {
                await _notasFiscaisService.DeleteAsync(id);
                return Ok();

            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

    }

    }

