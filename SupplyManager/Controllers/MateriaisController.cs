using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;
using SupplyManager.Validations.MateriaisValidations;
using System.Net;
using System.Text.RegularExpressions;

namespace SupplyManager.Controllers
{


    [ApiController]
    [Route("api/[controller]")]
    public class MateriaisController :ControllerBase
    {
        private readonly SqlContext _context;




        public MateriaisController(SqlContext context)
        {

            _context = context;
        }

        [HttpGet]

        public async Task<ActionResult<List<Material>>> GetAll()
        {

            var materiais = await _context.Materiais.ToListAsync();


            return materiais ==null ? NotFound() : Ok(materiais);

        }


        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
          public async Task<ActionResult<Material>> GetMaterial(int id)
          {

            try
            {
                var material = await _context.Materiais.FindAsync(id);

                return Ok(material);
            }

            catch (KeyNotFoundException)
            {
                return StatusCode(StatusCodes.Status400BadRequest);
            }
            catch(Exception exception) 
            {
                return StatusCode(StatusCodes.Status500InternalServerError,exception.Message);
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
                var queryMaterial =  from query in _context.Materiais select query;
             

                //Ordena a busca de materia
              
                queryMaterial =  queryMaterial.Where(x => x.Descricao.Contains(descricao)).OrderBy(x=>x.Descricao);


                return Ok( await queryMaterial.ToListAsync());
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
        public async Task<ActionResult> CreateMaterial([FromBody] Material model)
        {

            try
            {

                //Verifica se o modelo o código digitado do material já existe,caso sim,retornara bad request e uma mensagem de material já existe
                var checkCode = await _context.Materiais.FirstOrDefaultAsync(x => x.Codigo == model.Codigo);

                if (checkCode != null)
                {

                    return StatusCode(StatusCodes.Status400BadRequest, new { message = "Código já existe" });
                }

                /*    var checkDescription = await _context.Materiais.FirstOrDefaultAsync(x=>x.Descricao== model.Descricao);

                    if (checkDescription != null)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, new { message = "Um material com essa descrição já existe" });

                    }*/

                
                Material material = new Material()
                {

                    Codigo = model.Codigo.ToUpper(),
                    Descricao = model.Descricao.ToUpper(),
                    Marca = model.Marca == "" ? "-" : model.Marca.ToUpper(),
                    Corrente = model.Corrente == "" ? "-" : model.Corrente.ToUpper(),
                    Unidade = model.Unidade.ToUpper(),
                    Tensao = model.Tensao == "" ? "-" : model.Tensao.ToUpper(),
                    DataEntradaNF = model.DataEntradaNF,


                };

                MateriaisPostValidator m1 = new MateriaisPostValidator();

                var validationMaterial = m1.Validate(material);

                if (!validationMaterial.IsValid)
                {

                    return StatusCode(StatusCodes.Status400BadRequest, new { message = validationMaterial.Errors });
                };

                await _context.Materiais.AddAsync(material);



                await _context.SaveChangesAsync();
                return Ok(material);
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
        public async Task<ActionResult> PutMaterial([FromRoute] int id, [FromBody] Material model)
        {

            if (id != model.Id) return StatusCode(StatusCodes.Status400BadRequest);


            try {

                MaterialIdValidator material = new MaterialIdValidator();

                var materialValidation = material.Validate(id);


                var m1 = await _context.Materiais.FindAsync(model.Id);

                {
                    m1.Codigo = model.Codigo.ToUpper();
                    m1.Descricao = model.Descricao.ToUpper();
                    m1.Marca = model.Marca.ToUpper();
                    m1.Corrente = model.Corrente.ToUpper();
                    m1.Unidade = model.Unidade.ToUpper();
                    m1.Tensao = model.Tensao.ToUpper();
                    m1.DataEntradaNF = model.DataEntradaNF;

                }

                var updateMaterial = _context.Materiais.Update(m1);

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
                MaterialIdValidator m1 = new MaterialIdValidator();

                var materialValidation = m1.Validate(id);


                if (!materialValidation.IsValid)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { message = materialValidation.Errors });
                }

                var material = await _context.Materiais.FindAsync(id);

                _context.Materiais.Remove(material);


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
