using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Models;
using System.Diagnostics.Metrics;
using System.Net;
using MasterErp.Infraestructure.Context;

namespace MasterErp.Api.Controllers;

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

        /// <summary>
        /// Pega todos os itens criados
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Todos os itens ja criados</returns>
        [HttpGet()]
        public async Task<List<Item>> GetAll()
        {
            return (await _context.Itens.AsNoTracking().ToListAsync());
        }
        /// <summary>
        /// Pega o item por id
        /// </summary>
        /// <param name="id">Id do item</param>
        /// <returns>Item encontrado</returns>
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


        /// <summary>
        /// Pega todos os materiais e quantidade que estão presentes em uma ordem de serviço
        /// </summary>
        /// <param name="id">Id da ordem de serviço</param>
        /// <returns>Lista de todos os materias e suas quantidade presentes na Ordem de serviço</returns>
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
            var os = _context.OrdemSeparacoes;
            var itens =  await _context.Itens.ToListAsync();


            foreach (var item in itens)
            {
                if (item.OrdemSeparacaoId == id)
                {

                    var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == item.MaterialId);

                    var OrdemSeparacao = await _context.OrdemSeparacoes.FirstOrDefaultAsync(x => x.Id == item.OrdemSeparacaoId);

                    item.Material = material;

                    item.OrdemSeparacao = OrdemSeparacao;


                    itensWithMaterial.Add(item);

                }
                






            }
           

            return Ok(itensWithMaterial);



        }
        /// <summary>
        /// Cria novo item
        /// </summary>
        /// <param name="id">Objeto de item para ser criado</param>
        /// <returns>Item criado</returns>
        [HttpPost("CreateItem")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Item>> Create(ItemDto model)
        {
            try
            {
                Item item = new Item(model.MaterialId, model.OrdemSeparacaoId,model.Quantidade,model.Responsavel,model.DescricaoNaoCadastrado);
                 
                var material = await _context.Materiais.FirstOrDefaultAsync(x=>x.Id==model.MaterialId);

                var OrdemSeparacao = await _context.OrdemSeparacoes.FirstOrDefaultAsync(x=>x.Id == model.OrdemSeparacaoId);

            
                await _context.Itens.AddAsync(item);
                await _context.SaveChangesAsync();

                return Ok(item);



            }


            catch (Exception exception)
            {
            Console.WriteLine( exception);
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

        public async Task<ActionResult<Item>> Update([FromRoute] int id, [FromBody] Item model)
        {

            if (model.Id != id) return BadRequest();

            var item = await _context.Itens.FirstOrDefaultAsync(x => x.Id == id);

            item.Quantidade = model.Quantidade;
            item.Responsavel=model.Responsavel;
            _context.Itens.Update(item);
            await _context.SaveChangesAsync();

            return Ok();






        }
        /// <summary>
        /// Deleta item
        /// </summary>
        /// <param name="id">Id do item a ser deletado</param>
        /// <returns></returns>
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

