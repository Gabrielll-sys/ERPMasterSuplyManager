using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;
using SupplyManager.Validations.InventarioValidations;
using System.Net;

namespace SupplyManager.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class OrdemServicosController:ControllerBase
    {

        private readonly SqlContext _context;

        public OrdemServicosController(SqlContext context)
        {

            _context = context;
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<List<OrdemServico>> GetAll()
        {
            
            return await _context.OrdemServicos.ToListAsync();
        }



        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]


        public async Task<ActionResult<OrdemServico>> Get(int id)
        {


            var a = await _context.OrdemServicos.FirstOrDefaultAsync(x => x.Id == id);


            return Ok(a);



        }

        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<OrdemServico>> Create(OrdemServico model)
        {
            try
            {

                OrdemServico o1 = new OrdemServico(model.Descricao.ToUpper(), model.Responsavel,model.NumeroOs);

                await _context.OrdemServicos.AddAsync(o1);

                await _context.SaveChangesAsync();


                return Ok(o1);



            }


            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }





        }



        [HttpPut("updateAuhorize/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult> UpdateAuthorize([FromRoute] int id, [FromBody] OrdemServico model)
        {

            if (model.Id != id) return BadRequest();

            try
            {


                var itens = await _context.Itens.ToListAsync();

                var inventarios = await _context.Inventarios.ToListAsync();

                var ordemServico = await _context.OrdemServicos.FirstOrDefaultAsync(x => x.Id == id);

                {
                    ordemServico.Responsavel = model.Responsavel.ToUpper();

                }




                ordemServico.AutorizarOs();


                foreach (var item in itens)
                {
                    //Quando o item tiver o id da ordem de serviço a ser autorizada 
                    if(item.OrdemServicoId == id)
                    {
                        //Busca o material presente no item para pegar a unidade 
                        var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == item.MaterialId);

                        //Procura todos os inventários do material da tabela item,para posteriormente  subtrair do inventário a quantidade a ser utilizad na OS
                        var inventario = inventarios.Where(x => x.MaterialId == item.MaterialId).ToList();

                        
                        //Instacia um novo inventário para criar um novo inventário com a atualização de quantidade utilizada na os e o motivo,a descricação da os
                        Inventario i1 = new Inventario
                         (
                        ordemServico.Descricao,
                        inventario[inventario.Count-1].SaldoFinal,
                         inventario[inventario.Count - 1].Movimentacao,
                         inventario[inventario.Count - 1].SaldoFinal,
                         inventario[inventario.Count - 1].Responsavel,
                        item.MaterialId
                    );
                        //Formatara a string que aparece como a razao da movimentacão do inventário,caso OS seja da master elétrica,utilizará o próprio id
                        // D os como identificador pois no caso da master toda OS e sequencial,caso seja da brastorno será o numero deles ja vindo deles
                        string descricaoOsFormated = ordemServico.NumeroOs != null ? $" {item.Quantidade} {material.Unidade} {(item.Quantidade>1?"utilizadas":"utilizada")} na OS-{ordemServico.NumeroOs}-{ordemServico.Descricao}" : $"Material Utilizado na OS-{ordemServico.Id}-{ordemServico.Descricao}";

                        i1.MovimentacaoOrdemServico(item.Quantidade,descricaoOsFormated);

                        await _context.Inventarios.AddAsync(i1);
                    }

                }



                await _context.SaveChangesAsync();
                return Ok();

            }

            catch (KeyNotFoundException)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, exception);

            }




        }


        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<OrdemServico>> Update([FromRoute] int id, [FromBody] OrdemServico model)
        {

            if (model.Id != id) return BadRequest();

            var a = await _context.OrdemServicos.FirstOrDefaultAsync(x => x.Id == id);

            return Ok();






        }













    }
}
