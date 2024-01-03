using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;
using System.Diagnostics.Metrics;
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
        [HttpGet("GetAllMateriaisOs/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<Item>> GetAllMateriasOs(int id)
        {
 
            List<Item> itensWithMaterial = new List<Item>();

            var materias = _context.Materiais;
            var os = _context.OrdemServicos;
            var itens =  await _context.Itens.ToListAsync();


            foreach (var item in itens)
            {
                if (item.OrdemServicoId == id)
                {

                    var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == item.MaterialId);

                    var ordemServico = await _context.OrdemServicos.FirstOrDefaultAsync(x => x.Id == item.OrdemServicoId);

                    item.Material = material;

                    item.OrdemServico = ordemServico;


                    itensWithMaterial.Add(item);

                }
                






            }
           

            return Ok(itensWithMaterial);



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
                Item item = new Item(model.MaterialId, model.OrdemServicoId,model.Quantidade,model.Responsavel);
                 
                var material = await _context.Materiais.FirstOrDefaultAsync(x=>x.Id==model.MaterialId);

                var ordemServico = await _context.OrdemServicos.FirstOrDefaultAsync(x=>x.Id == model.OrdemServicoId);

                item.Material = material;
                item.OrdemServico = ordemServico;
                await _context.Itens.AddAsync(item);
                await _context.SaveChangesAsync();

                return Ok(item);



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

        public async Task<ActionResult<Item>> Update([FromRoute] int id, [FromBody] Item model)
        {

            if (model.Id != id) return BadRequest();

            var item = await _context.Itens.FirstOrDefaultAsync(x => x.Id == id);

            item.Quantidade = model.Quantidade;

            var a = 20;
            return Ok();






        }

        [HttpDelete("{id}")]

        public async Task<ActionResult> Delete (int id)
        {
            var item = await _context.Itens.FirstOrDefaultAsync(x => x.Id==id);

            try
            {
                _context.Itens.Remove(item);
                await _context.SaveChangesAsync();
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
