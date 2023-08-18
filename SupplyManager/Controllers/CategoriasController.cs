using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;
using SupplyManager.Validations;
using SupplyManager.Validations.MateriaisValidations;
using System.Net;

namespace SupplyManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase

    {
        private readonly SqlContext _context;




        public CategoriasController(SqlContext context)
        {

            _context = context;
        }

        [HttpGet]

        public async Task<ActionResult<List<Categoria>>> GetAll()
        {

            var categorias = await _context.Categorias.ToListAsync();


            return categorias == null ? NotFound() : Ok(categorias);

        }


        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> GetCategoria(int id)
        {

            try
            {/*
                var categoria = await _context.Categorias.FirstOrDefaultAsync(x => x.MaterialId == id);*/
                var categoria = await _context.Categorias.Include(x=>x.Material).FirstOrDefaultAsync(x => x.MaterialId== id);

                return Ok(categoria);
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

        [HttpGet(template: "busca")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> Busca(string categoria)
        {


            try
            {
                List<Material> materiais = new List<Material>(10000);
                var queryMaterial = from query in _context.Materiais select query;
                var queryCategoria = from query in _context.Categorias select query;

                //Ordena a busca de materia
                queryCategoria = queryCategoria.Where(c => c.NomeCategoria.Contains(categoria));
                var v = queryCategoria.ToList();

                foreach ( var item in v)
                {
                    var a = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == item.MaterialId);


                    materiais.Add(a);
                    
                }



                return Ok( materiais);
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
        public async Task<ActionResult> CreateCategoria([FromBody] Categoria model)
        {
            try
            {
                var material = await _context.Materiais.FirstAsync(x=>x.Id==model.MaterialId);




                Categoria categoria = new Categoria()
                {
                    NomeCategoria = model.NomeCategoria.ToUpper(),
                    MaterialId = model.MaterialId,
                    Material=material,

                };

                CategoriaPostValidation v1 = new CategoriaPostValidation();

                var validateCategory  = v1.Validate(categoria);



                if (!validateCategory.IsValid)
                {

                    return StatusCode(StatusCodes.Status400BadRequest);
                }
                await _context.Categorias.AddAsync(categoria);



                await _context.SaveChangesAsync();
                return Ok(categoria);
            }
            catch (Exception ex)
            {
                throw;

            }

        }


        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> PutCategoria([FromRoute] int id, [FromBody] Categoria categoria)
        {

            if (id != categoria.Id) return StatusCode(StatusCodes.Status400BadRequest);


            try
            {

                //Procura pelo material para o objeto ser passado para a update da categoria
                var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == id);

                //Busca em categorias pelo id do material
                var c1 = await _context.Categorias.FirstOrDefaultAsync(x => x.MaterialId == id);
                {
                    c1.NomeCategoria = categoria.NomeCategoria;
                    c1.Material = material;
                }

          

                var updatedCategoria = _context.Categorias.Update(c1);

                await _context.SaveChangesAsync();

                return Ok();


            }
            catch (KeyNotFoundException ex)
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
                var categoria = await _context.Categorias.FindAsync(id);

                _context.Categorias.Remove(categoria);


                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return StatusCode(StatusCodes.Status404NotFound);

            }
            catch (Exception ex)
            {

                return StatusCode(StatusCodes.Status500InternalServerError);

            }



        }




















    }
}
