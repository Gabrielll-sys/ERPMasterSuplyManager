using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;
using SupplyManager.Validations.MateriaisValidations;
using System.Net;
using System.Text.RegularExpressions;
using System.IO;
using SupplyManager.Extensions;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System.ComponentModel;
using System.Linq;
using SupplyManager.Interfaces;
using Microsoft.AspNetCore.Authorization;
using MySqlConnector;
using SupplyManager.Services;

namespace SupplyManager.Controllers
{

    ///<summary>
    ///Controlador para gerenciar os Materias
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    /*[Authorize]*/
     public class MateriaisController : ControllerBase
    {
        private readonly SqlContext _context;
        private readonly IMaterialService _materialService;
     


        public MateriaisController(SqlContext context,IMaterialService materialService)
        {
            _context = context;
            _materialService = materialService;
        }

        /// <summary>
        /// Busca todos os materiais
        /// </summary>
        /// <returns>Todos os materiais </returns>
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<List<Material>>> GetAll()
        {
           

            return Ok(await _materialService.GetAllAsync());
  

        }

        /// <summary>
        /// Obtem material por id
        /// </summary>
        /// <param name="id">Id do material para ser obtido</param>
        /// <returns>Materiais encontrado</returns>
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
                var a = 20;
                return Ok( await _materialService.GetByIdAsync(id));
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
        /// <summary>
        /// Obtem material com o ultimo registro de seu inventário
        /// </summary>
        /// <param name="id">Id do material</param>
        /// <returns>Material e inventário encontrado</returns>
        [HttpGet("getMaterialWithInvetory/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> GetMaterialwithInvetory(int id)
        {

            try
            {
                var materialWithInventory = await _context.Inventarios
                    .Include(s => s.Material)
                    .Where(x =>x.MaterialId==id)
                    .ToListAsync();

                return Ok(materialWithInventory[materialWithInventory.Count-1]);
                
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
        
        /// <summary>
        /// Criar novo material
        /// </summary>
        /// <param name="id">Objeto material para ser criado</param>
        /// <returns>Materiais criado</returns>
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
                var queryMaterial = from query in _context.Materiais select query;

                MateriaisPostValidator ValidationMaterial = new MateriaisPostValidator();

                //Verifica se o modelo o código digitado do material já existe,caso sim,retornara bad request e uma mensagem de material já existe
                var checkInternCode = await _context.Materiais.FirstOrDefaultAsync(x => x.CodigoInterno == model.CodigoInterno);
               
                //Busca codigo do fabricante para ver se ja possui ,e tambem poe uma condição para caso seja diferente de vazio,pois a criação de material pode ter o código vazio
                var checkFabricanteCode = await _context.Materiais
                    .FirstOrDefaultAsync(x => x.CodigoFabricante == model.CodigoFabricante  &&  model.CodigoFabricante!="");

                

                if (checkFabricanteCode != null)
                {

                    return StatusCode(StatusCodes.Status400BadRequest, new { message = "Código de fabricante já existe" });

                }


                var material = await _materialService.CreateAsync(model);


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

            try
            {
                var materialUpdated = await _materialService.UpdateAsync(model);
                
                return Ok(materialUpdated);

            }
            catch (KeyNotFoundException exception)
            {

                return StatusCode(StatusCodes.Status404NotFound, exception.Message);
            }


   

        }
        /// <summary>
        /// Deleta o material pelo id fornecido
        /// </summary>
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
                await _materialService.DeleteAsync(id);

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
