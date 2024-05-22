using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using System.Net;

namespace MasterErp.Api.Controllers;


    ///<summary>
    ///Controlador para gerenciar as Notas Fiscais
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class NotasFiscaisController : ControllerBase
    {

        private readonly SqlContext _context;

        public NotasFiscaisController(SqlContext context)
        {
            _context = context;
        }


        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<List<NotaFiscal>>> GetAll()
        {
            try
            {
                return await _context.NotasFiscais.AsNoTracking().ToListAsync();
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
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<NotaFiscal>> GetById(int id)
        {
            try
            {
                return await _context.NotasFiscais.FirstOrDefaultAsync(x=>x.Id==id);
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

        public async Task<ActionResult<NotaFiscal>> Post([FromBody]NotaFiscal model)
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

               var notaFiscal = await _context.NotasFiscais.AddAsync(n1);
                await _context.SaveChangesAsync();
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
                NotaFiscal notaFiscal = new NotaFiscal()
                {
                    BaseCalculoICMS = model.BaseCalculoICMS,
                    CFOP = model.CFOP,
                    Frete = model.Frete,
                    DataEmissaoNF = model.DataEmissaoNF,
                    NumeroNF = model.NumeroNF,
                    ValorICMS = model.ValorICMS
                };
                 _context.NotasFiscais.Update(notaFiscal);
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

        public async Task <ActionResult> Delete(int id)
        {


            try
            {
                var notaFiscal = await _context.NotasFiscais.FindAsync(id) ?? throw new KeyNotFoundException();
                 _context.NotasFiscais.Remove(notaFiscal);
                await _context.SaveChangesAsync();  
                return Ok();

            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

    }

    

