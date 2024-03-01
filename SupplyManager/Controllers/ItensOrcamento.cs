using Microsoft.AspNetCore.Http;
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
    public class ItensOrcamento : Controller
    {
        private readonly SqlContext _context;

       
            public ItensOrcamento(SqlContext context)
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
            return (await _context.Itens.ToListAsync());
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
            var os = _context.Orcamentos;
            var itens = await _context.ItensOrcamento.ToListAsync();


            foreach (var item in itens)
            {
                if (item.OrdemServicoId == id)
                {

                    var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == item.MaterialId);

                    var ordemServico = await _context.Orcamentos.FirstOrDefaultAsync(x => x.Id == item.OrcamentoId);

                    item.Material = material;

                    item.OrdemServico = ordemServico;


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
        public async Task<ActionResult<Item>> Create(ItemOrcamento model)
        {
            try
            {
                ItemOrcamento item = new ItemOrcamento()
                {
                    DataAdicaoItem = DateTime.UtcNow.AddHours(-3),
                    MaterialId = model.MaterialId,
                    QuantidadeMaterial = model.QuantidadeMaterial,
                    
                    
                };

                var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == model.MaterialId);

                var ordemServico = await _context.Orcamentos.FirstOrDefaultAsync(x => x.Id == model.OrcamentoId);


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

        public async Task<ActionResult<ItemOrcamento>> Update([FromRoute] int id, [FromBody] ItemOrcamento model)
        {

            if (model.Id != id) return BadRequest();

            var item = await _context.ItensOrcamento.FirstOrDefaultAsync(x => x.Id == id);

            item.QuantidadeMaterial = model.QuantidadeMaterial;
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
}
}
