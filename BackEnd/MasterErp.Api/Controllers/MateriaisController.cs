using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using MasterErp.Infraestructure;
using Microsoft.AspNetCore.Authorization;
using static Microsoft.AspNetCore.Http.StatusCodes;


using FluentValidation.Results;
using Humanizer;
using MasterErp.Api.ViewModels;
using MasterErp.Api.Extensions;
using MasterErp.Domain.Validations.MateriaisValidations;
using System.Net;

namespace MasterErp.Api.Controllers;

    ///<summary>
    ///Controlador para gerenciar os Materias
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
     public class MateriaisController : ControllerBase
    {
        private readonly SqlContext _context;
        private readonly IMaterialService _materialService;

        public MateriaisController(SqlContext context,IMaterialService materialService)
        {
            _context = context;
            _materialService = materialService;
           
        }


        [AllowAnonymous]
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
                List<Inventario> materialWithInventory = await _context.Inventarios
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
        /// <param name="dto"></param>
        /// <param name="id">Objeto material para ser criado</param>
        /// <returns>Materiais criado</returns>
        [HttpPost()]

        [ProducesResponseType(Status200OK, Type = typeof(MaterialDto))]
        [ProducesResponseType(Status401Unauthorized, Type = typeof(MaterialDto))]
        [ProducesResponseType(Status400BadRequest, Type = typeof(ValidationErrorResponse))]
        [ProducesResponseType(Status500InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<ActionResult> CreateMaterial([FromBody] MaterialDto dto)
        {

            try
            {
                var queryMaterial = from query in _context.Materiais select query;

                //Busca codigo do fabricante para ver se ja possui ,e tambem poe uma condição para caso seja diferente de vazio,pois a criação de material pode ter o código vazio
                var checkFabricanteCode = await _context.Materiais
                    .FirstOrDefaultAsync(x => x.CodigoFabricante == dto.CodigoFabricante  &&  dto.CodigoFabricante!="");


                if (checkFabricanteCode != null)
                {

                    return StatusCode(StatusCodes.Status400BadRequest, new { message = "Código de fabricante já existe" });

                }

                var m1 = new Material(
                 dto.CodigoInterno,
                 dto.CodigoFabricante,
                 dto.Descricao,
                 dto.Categoria,
                 dto.Marca,
                 dto.Corrente,
                 dto.Unidade,
                 dto.Tensao,
                 dto.Localizacao,
                 dto.DataEntradaNF,
                 dto.PrecoCusto,
                 dto.Markup
             );

                MaterialPostValidator validationRules = new MaterialPostValidator();

                ValidationResult validationResult = validationRules.Validate(m1);

                if (!validationResult.IsValid)
                {
                    return StatusCode(Status400BadRequest, validationResult.ToValidationErrorReponse());

                }

                var material = await _materialService.CreateAsync(m1);


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
