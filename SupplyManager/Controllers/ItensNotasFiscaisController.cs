using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
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
        private readonly SqlContext _context;
     

        public ItensNotasFiscaisController(SqlContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<ItemNotaFiscal>> GetById(int id)
        {
            try
            {
                return await _context.ItensNotaFiscal.FirstOrDefaultAsync(x=>x.Id==id) ;
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
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<List<ItemNotaFiscal>>> GetAll()
        {
            try
            {
                return await _context.ItensNotaFiscal.ToListAsync() ;
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
            
                


                ItemNotaFiscal n1 = new ItemNotaFiscal()
                {

                    AliquotaICMS = model.AliquotaICMS,
                    AliquotaIPI = model.AliquotaIPI,
                    NotaFiscalId = model.NotaFiscalId,
                    MaterialId = model.MaterialId,
                    Quantidade = model.Quantidade,
                    ValorUnitario = model.ValorUnitario,
                    

                };

                var itemNotaFiscal = await _context.ItensNotaFiscal.AddAsync(n1);

                return Ok(itemNotaFiscal);


            

           
        }

        [HttpPut("{id}")]
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
                var item = await _context.ItensNotaFiscal.FindAsync(id) ?? throw new KeyNotFoundException();
                {
                    item.NotaFiscalId = model.NotaFiscalId;
                    item.MaterialId = model.MaterialId;
                    item.ValorUnitario = model.ValorUnitario;
                    item.AliquotaIPI = model.AliquotaIPI;
                    item.AliquotaICMS = model.AliquotaICMS;
                    item.Quantidade = model.Quantidade;

                }
                _context.Update(model);
                await _context.SaveChangesAsync();
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
                var item = await _context.ItensNotaFiscal.FindAsync(id)?? throw new KeyNotFoundException();

                _context.Remove(item);
                return Ok();

            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }


    }
}
