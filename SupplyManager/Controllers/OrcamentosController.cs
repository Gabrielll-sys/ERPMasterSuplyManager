using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SupplyManager.App;
using SupplyManager.Models;
using System;
using Microsoft.AspNetCore.Authorization;
using SupplyManager.Services;

namespace SupplyManager.Controllers
{    ///<summary>
     ///Controlador para gerenciar Orçamentos
     /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    /*[Authorize]*/
    public class OrcamentosController: ControllerBase
    {
        public readonly SqlContext _context;

        private readonly IOrcamentoService _orcamentoService;

        public OrcamentosController(SqlContext context, IOrcamentoService orcamentoService )
        {

            _context = context;
            _orcamentoService = orcamentoService;
        }



        [HttpGet]
        public async Task<ActionResult<List<Orcamento>>> GetAll()
        {
       
            return Ok(await _orcamentoService.GetAllAsync());


        }
        [HttpGet("buscaNomeCliente")]
        public async Task<ActionResult<List<Orcamento>>> GetByClientName(string cliente)
        {


            return await _orcamentoService.GetByClientName(cliente);

        }

        //Busca cliente,para caso exista,preencher automaticamente informações do cliente
        [HttpGet("buscaCliente")]
        public async Task<ActionResult<Orcamento>> GetClient(string cliente)
        {
            try
            {

                return await _orcamentoService.GetClient(cliente);

            }catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }



        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Orcamento>> Get(int id)
        {
            try
            {
               return Ok(await _context.Orcamentos.FirstOrDefaultAsync(x=>x.Id==id));

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

    
        [HttpPost]
        public async Task<ActionResult<Orcamento>> Post([FromBody] Orcamento model)
        {
            try
            {
                
               var orcamento =  await _orcamentoService.CreateAsync(model);
               
               return Ok(orcamento);
                

            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }

        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] Orcamento model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                await _orcamentoService.UpdateAsync(model);

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
        [HttpPut("sellUpdate/{id}")]
        public async Task<ActionResult> PutSell(int id, [FromBody] Orcamento model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var o1 = await _context.Orcamentos.FindAsync(id) ?? throw new KeyNotFoundException();

             

                var itens = await _context.ItensOrcamento.ToListAsync();

                var inventarios = await _context.Inventarios.ToListAsync();

                var orcamento = await _context.Orcamentos.FirstOrDefaultAsync(x => x.Id == id);

                {

                    orcamento.DataVenda = DateTime.UtcNow.AddHours(-3);
                    orcamento.IsPayed = true;

                }




     


                foreach (var item in itens)
                {
                    //Quando o item tiver o id da ordem de serviço a ser autorizada 
                    if (item.OrcamentoId == id)
                    {
                        //Busca o material presente no item para pegar a unidade 
                        var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == item.MaterialId);

                        //Procura todos os inventários do material da tabela item,para posteriormente  subtrair do inventário a quantidade a ser utilizad na OS
                        var inventario = inventarios
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();


                        //Instacia um novo inventário para criar um novo inventário com a atualização de quantidade utilizada no orcamento e o motivo,a descricação da os
                        Inventario i1 = new Inventario
                         (
                        $"Utilizado Orcamento Nº {orcamento.Id}",
                         inventario[inventario.Count - 1].SaldoFinal,
                         inventario[inventario.Count - 1].Movimentacao,
                         inventario[inventario.Count - 1].SaldoFinal,
                         inventario[inventario.Count - 1].Responsavel,
                        item.MaterialId
                    );
                    

                        i1.MovimentacaoOrdemServico((float)item.QuantidadeMaterial, $"Utilizado Orcamento Nº {orcamento.Id} De {orcamento.NomeCliente} ");

                        await _context.Inventarios.AddAsync(i1);
                    }

                }


                _context.Orcamentos.Update(orcamento);

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

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {

                await _orcamentoService.DeleteAsync(id);

                return Ok();

            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }


        }
    }

}

