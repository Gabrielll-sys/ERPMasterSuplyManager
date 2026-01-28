using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterErp.Infraestructure.Context;
using MasterErp.Domain.Models;
using System.Net;
using MasterErp.Infraestructure.Context;

namespace MasterErp.Api.Controllers;

    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
    public class ItensOrcamentoController : Controller
    {
        private readonly SqlContext _context;

       
            public ItensOrcamentoController(SqlContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Pega todos os itens criados
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Todos os itens ja criados</returns>
        [HttpGet()]
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

        public async Task<List<ItemOrcamento>> GetAll()
        {
            return (await _context.ItensOrcamento.AsNoTracking().ToListAsync());
        }

        /// <summary>
        /// Pega todos os itens criados
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Todos os itens ja criados</returns>
        [HttpGet("getAllItensOrcamento/{id}")]
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

        public async Task<List<ItemOrcamento>> GetAllItenInOrcamento(int id)
        {
            return (await _context.ItensOrcamento.AsNoTracking().Where(x=>x.OrcamentoId==id).ToListAsync());
        }


        /// <summary>
        /// Pega o item por id
        /// </summary>
        /// <param name="id">Id do item</param>
        /// <returns>Item encontrado</returns>
        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]


        public async Task<ActionResult<ItemOrcamento>> Get(int id)
        {


            var a = await _context.ItensOrcamento.FirstOrDefaultAsync(x => x.Id == id);


            return Ok(a);



        }


        /// <summary>
        /// Pega todos os materiais e quantidade que estão presentes em uma ordem de serviço
        /// </summary>
        /// <param name="id">Id da ordem de serviço</param>
        /// <returns>Lista de todos os materias e suas quantidade presentes na Ordem de serviço</returns>
        [HttpGet("GetAllMateriaisOrcamento/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

        public async Task<ActionResult<List<ItemOrcamento>>> GetAllMateriasOrcamento(int id)
        {
            try
            {
                var itensWithMaterial = await _context.ItensOrcamento
                    .AsNoTracking()
                    .Include(x => x.Material)
                    .Include(x => x.Orcamento)
                    .Where(x => x.OrcamentoId == id)
                    .OrderBy(x => x.Material != null ? x.Material.Descricao : string.Empty)
                    .ToListAsync();

                return Ok(itensWithMaterial);
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }
        /// <summary>
        /// Cria novo item
        /// </summary>
        /// <param name="id">Objeto de item para ser criado</param>
        /// <returns>Item criado</returns>
        [HttpPost("CreateItemOrcamento")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

        public async Task<ActionResult<ItemOrcamento>> Create(ItemOrcamento model)
        {
            try
            {
                ItemOrcamento item = new ItemOrcamento()
                {
                    DataAdicaoItem = DateTime.UtcNow.AddHours(-3),
                    MaterialId = model.MaterialId,
                    QuantidadeMaterial = model.QuantidadeMaterial,
                    OrcamentoId = model.OrcamentoId,
                    
                };

            

                await _context.ItensOrcamento.AddAsync(item);
                await _context.SaveChangesAsync();

                return Ok(item);



            }


            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }





        }





        /// <summary>
        /// Atualiza Item
        /// </summary>
        /// <param name="id">Id do item a ser atualizado e seu objeto</param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

        public async Task<ActionResult<ItemOrcamento>> Update([FromRoute] int id, [FromBody] ItemOrcamento model)
        {

            if (model.Id != id) return BadRequest();

            var item = await _context.ItensOrcamento.FirstOrDefaultAsync(x => x.Id == id);

            item.QuantidadeMaterial = model.QuantidadeMaterial;
            item.PrecoItemOrcamento = model.PrecoItemOrcamento;
            _context.ItensOrcamento.Update(item);
            await _context.SaveChangesAsync();

            return Ok();






        }
        /// <summary>
        /// Deleta item
        /// </summary>
        /// <param name="id">Id do item a ser deletado</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

        public async Task<ActionResult> Delete(int id)
        {
            var item = await _context.ItensOrcamento.FirstOrDefaultAsync(x => x.Id == id);

            try
            {
                _context.ItensOrcamento.Remove(item);
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


