using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Project;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using SupplyManager.App;
using SupplyManager.Models;
using SupplyManager.Validations.InventarioValidations;
using SupplyManager.Validations.MateriaisValidations;

namespace SupplyManager.Controllers
{
    ///<summary>
    ///Controlador para gerenciar os Materias
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class InventariosController : ControllerBase
    {
        private readonly SqlContext _context;





        public InventariosController(SqlContext context)
        {

            _context = context;
        }



        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> GetInventario(int id)
        {

            try
            {

                var material = await _context.Inventarios.FindAsync(id);

                return Ok(material);
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

        //Metodo para trazer a lista de material e inventário junto
        [HttpGet("buscaCodigoInventario/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> BuscaCodigoInventario(int id)
        {


            try

            {


                var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == id);





                var listInvetory = await _context.Inventarios.Where(x => x.MaterialId == id).Include(x => x.Material).ToListAsync();
                //Ordena a busca de materia






                return Ok(listInvetory);
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

        [HttpGet(template: "buscaDescricaoInventario")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Inventario>> BuscaDescricaoInventario(string descricao)
        {


            try
            {
                var queryMaterial = from query in _context.Materiais select query;
                var queryInvetory = await _context.Inventarios.ToListAsync();

                List<Inventario> listInvetory = new List<Inventario>();


                //Realiza uma busca no banco de materias para buscar match na descrição de acordo com a busca
                queryMaterial = queryMaterial.Where(x => x.Descricao.Contains(descricao)).OrderBy(x => x.Id);
                var materiais = await queryMaterial.ToListAsync();
                //Faz um iteração em todos os materiais com aquela descrição
                foreach(var item in materiais)
                {
                    //Realiza um filtro buscando todos os invetários daquele material,ou seja,retornara todos os registros de invetário daquele produto
                    var inventarios = queryInvetory.Where(x => x.MaterialId == item.Id).ToList();
                    

                    var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == inventarios[0].MaterialId);


                    inventarios[inventarios.Count - 1].Material = material;



                    listInvetory.Add(inventarios[inventarios.Count-1]);

                   

                   

                }

                return Ok( listInvetory);
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
        public async Task<ActionResult> CreateInvetario([FromBody] Inventario model)
        {

            try
            {
                var queryMaterial = from query in _context.Inventarios select query;


                queryMaterial = queryMaterial.Where(x => x.MaterialId == model.MaterialId).OrderBy(x => x.Id);

                var b = await queryMaterial.ToListAsync();
                //CASO SEJA O PRIMEIRO ITEM DO INVENTÁRIO OU QUANDO FOR CRIAR DE FATO O SEGUNDO ITEM
                if (b.Count == 0 || b.Count == 1)
                {
                    InvetarioPostValidator ValidationInvetory = new InvetarioPostValidator();

                    Inventario invetory1 = new Inventario
                        (
                        model.Razao,
                        0,
                        model.Movimentacao,
                        model.SaldoFinal,
                        model.Responsavel,
                        model.MaterialId
                        );


                    invetory1.EstoqueMovimentacao(model.SaldoFinal);
                    await _context.Inventarios.AddAsync(invetory1);



                    await _context.SaveChangesAsync();

                    return Ok(invetory1);

                }
                InvetarioPostValidator ValidationMaterial = new InvetarioPostValidator();

                Inventario i1 = new Inventario
                    (
                    model.Razao,
                    model.Estoque,
                    model.Movimentacao,
                    model.SaldoFinal,
                    model.Responsavel,
                    model.MaterialId
                    );

                var a = i1.EstoqueMovimentacao(model.SaldoFinal);



                await _context.Inventarios.AddAsync(i1);



                await _context.SaveChangesAsync();

                return Ok(i1);


            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }

        }
        /// <summary>
        /// Atualizar o Material pelo Id
        /// </summary>
        /// <param name="id">O Id do material a ser atualizado</param>
        /// <param name="model">O objeto material a ser atualizado </param>
        /// <response code="200">Material encontrado</response>
        /// <response code="400">Id do material não é valido</response>
        /// <response code="404">Material não encontrado</response>
        /// <response code="500">Error no servidor</response>
        /// <returns>O material atualizado</returns>

        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> PutInventario([FromRoute] int id, [FromBody] Inventario model)
        {

            if (id != model.Id) return StatusCode(StatusCodes.Status400BadRequest);

            var queryInventario = from query in _context.Inventarios select query;






            try
            {


                var m1 = await _context.Inventarios.FindAsync(model.Id);

                {



                }

                _context.Inventarios.Update(m1);

                await _context.SaveChangesAsync();



                return Ok();


            }
            catch (KeyNotFoundException exception)
            {

                return StatusCode(StatusCodes.Status404NotFound, exception.Message);
            }




        }
        /// <summary>
        /// Deleta o material pelo id fornecido
        /// </summary>
        /// 
        /// <param name="id"> O id do material a ser deletado</param>
        /// <returns></returns>

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
                InventarioIdValidator m1 = new InventarioIdValidator();

                var inventarioValidation = m1.Validate(id);


                if (!inventarioValidation.IsValid)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { message = inventarioValidation.Errors });
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
        [HttpPost("populate")]

        public async Task PopulateDb()
        {


            var queryMaterialWithNoInvetory = await _context.Materiais.ToListAsync();



            foreach (var material in queryMaterialWithNoInvetory)
            {
                var findInvetory = await _context.Inventarios.FirstOrDefaultAsync(x => x.MaterialId == material.Id);


                if (findInvetory == null)
                {
                    Inventario invetario = new Inventario
                      (
                      null,
                      0,
                      null,
                     null,
                      null,
                      material.Id
                      );



                    await _context.Inventarios.AddAsync(invetario);






                }


            }

            await _context.SaveChangesAsync();


        }
    }
}



        
    
