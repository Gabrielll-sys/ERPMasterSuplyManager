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
    public class OrdemServicosController:ControllerBase
    {

        private readonly SqlContext _context;

        public OrdemServicosController(SqlContext context)
        {

            _context = context;
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<List<OrdemServico>> GetAll()
        {

            return await _context.OrdemServicos.ToListAsync();
        }



        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]


        public async Task<ActionResult<OrdemServico>> Get(int id)
        {


            var a = await _context.OrdemServicos.FirstOrDefaultAsync(x => x.Id == id);


            return Ok(a);



        }

        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<OrdemServico>> Create(OrdemServico model)
        {
            try
            {

                OrdemServico o1 = new OrdemServico(model.Descricao, model.Responsavel,model.NumeroOs);

                await _context.OrdemServicos.AddAsync(o1);

                await _context.SaveChangesAsync();


                return Ok(o1);



            }


            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }





        }



        [HttpPut("updateAuthorize/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<OrdemServico>> UpdateAuthorize([FromRoute] int id, [FromBody] OrdemServico model)
        {

            if (model.Id != id) return BadRequest();


            var itens = await _context.Itens.ToListAsync();

            var a = await _context.OrdemServicos.FirstOrDefaultAsync(x => x.Id == id);

            return NotFound();
            try
            {

                a.AutorizarOs();


                foreach (Item item in itens)
                {
                    if (item.OrdemServicoId == model.Id)
                    {

                        var invetario = await _context.Inventarios.FirstOrDefaultAsync();



                        return Ok();

                    }



                }


            }

            catch (KeyNotFoundException)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, exception);

            }




        }


        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<OrdemServico>> Update([FromRoute] int id, [FromBody] OrdemServico model)
        {

            if (model.Id != id) return BadRequest();

            var a = await _context.OrdemServicos.FirstOrDefaultAsync(x => x.Id == id);

            return Ok();






        }













    }
}
