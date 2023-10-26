using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;
using System.Net;

namespace SupplyManager.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]

    public class ItensController : ControllerBase
    {
        private readonly SqlContext _context;

        public ItensController(SqlContext context)
        {

            _context = context;
        }


        [HttpGet()]
        public async Task<List<Item>> GetAll()
        {
            return (await _context.Itens.ToListAsync());
        }

        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<Item>> Get(int id)
        {


            var a = await _context.Itens.FirstOrDefaultAsync(x => x.Id == id);


            return Ok(a);



        }

        [HttpPost("CreateItem")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Item>> Create(Item model)
        {
            try
            {
                Item item = new Item(model.MaterialId, model.OrdemServicoId);



                return Ok(item);



            }


            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }





        }


/*
        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<Item>> UpdateAuthorize([FromRoute] int id, [FromBody] OrdemServico model)
        {

            if (model.Id != id) return BadRequest();


            var itens = await _context.Itens.ToListAsync();

            var a = await _context.OrdemServicos.FirstOrDefaultAsync(x => x.Id == id);

            
            try
            {
                return Ok(a);


            }

            catch (KeyNotFoundException)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, exception);

            }




        }*/


        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<Item>> Update([FromRoute] int id, [FromBody] Item model)
        {

            if (model.Id != id) return BadRequest();

            var a = await _context.OrdemServicos.FirstOrDefaultAsync(x => x.Id == id);

            return Ok();






        }

        [HttpDelete("{id}")]


        public async Task<ActionResult> Delete (int id)
        {
            var item = await _context.Itens.FirstOrDefaultAsync(x => x.Id==id);

            try
            {
                _context.Remove(item);
                _context.SaveChangesAsync();
                return Ok();

            }
            catch (KeyNotFoundException)
            {

                return StatusCode(StatusCodes.Status404NotFound);
            }
            catch(Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,exception.Message);
            }


        }
    }
}
