using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;
using SupplyManager.Validations.InventarioValidations;
using SupplyManager.Validations.MateriaisValidations;
using System.Net;
using System.Text.RegularExpressions;


namespace SupplyManager.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class InventariosController : ControllerBase
    {
        public readonly SqlContext _context;


        public InventariosController(SqlContext context)
        {

            _context = context;

        }

        [HttpGet]


        public async Task<ActionResult<List<Inventario>>> GetAllInvetariosAsync()
        {


            var inventarios = await _context.Inventarios.ToListAsync();

            return inventarios != null ? Ok(inventarios) : NotFound();



        }


        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<Inventario>> Get(int id)
        {

            try
            {
                var inventario = await _context.Inventarios.FirstOrDefaultAsync(x => x.Id == id);

                return Ok(inventario);

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
        [HttpGet(template: "busca")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> Busca(string descricao)
        {


            try
            {
                var queryMaterial = from query in _context.Inventarios select query;


                //Ordena a busca de materia

                queryMaterial = queryMaterial.Where(x => x.Descricao.Contains(descricao)).OrderBy(x => x.Descricao);


                return Ok(await queryMaterial.ToListAsync());
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
        [HttpPost()]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<Inventario>> CreateInventario(Inventario model)
        {

            try
            {
                Inventario inventario = new Inventario(model.Descricao, model.Razao, model.Estoque, model.Movimentacao, model.SaldoFinal,model.Responsavel);

                InvetarioPostValidator Inv1 = new InvetarioPostValidator();

                var validationInventory = Inv1.Validate(inventario);



                if (!validationInventory.IsValid)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { message = validationInventory.Errors });

                }

                await _context.Inventarios.AddAsync(inventario);

                await _context.SaveChangesAsync();

                return Ok(inventario);



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

        public async Task<ActionResult<Inventario>> Put([FromRoute] int id, [FromBody] Inventario model)
        {
            if (id != model.Id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var inventario = await _context.Inventarios.FirstOrDefaultAsync(x => x.Id == model.Id);

                var response= inventario.EstoqueMovimentacao(model.SaldoFinal);
                _context.Update(inventario);
                await _context.SaveChangesAsync();

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

        [HttpDelete("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                InventarioIdValidator inv1 = new InventarioIdValidator();

                var invetoryValidator = inv1.Validate(id);
                if (!invetoryValidator.IsValid)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, invetoryValidator.Errors);

                }


                var inventario = await _context.Inventarios.FindAsync(id);

                _context.Inventarios.Remove(inventario);

                await _context.SaveChangesAsync();

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
}