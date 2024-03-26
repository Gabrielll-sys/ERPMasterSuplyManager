using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SupplyManager.App;
using SupplyManager.Models;

namespace SupplyManager.Controllers
{    ///<summary>
     ///Controlador para gerenciar Orçamentos
     /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class OrcamentosController: ControllerBase
    {
        public readonly SqlContext _context;

        public OrcamentosController(SqlContext context)
        {

            _context = context;
        }



        [HttpGet]
        public async Task<ActionResult<List<Orcamento>>> GetAll()
        {
       
            return Ok(await _context.Orcamentos.AsNoTracking().OrderByDescending(x=>x.DataOrcamento).ToListAsync());


        }
        [HttpGet("buscaNomeCliente")]
        public async Task<ActionResult<List<Orcamento>>> GetByClientName(string cliente)
        {


            return await _context.Orcamentos.AsNoTracking().Where(x => x.NomeCliente.Contains(cliente)).OrderBy(x => x.DataOrcamento).ToListAsync();

        }

        //Busca cliente,para caso exista,preencher automaticamente informações do cliente
        [HttpGet("buscaCliente")]
        public async Task<ActionResult<Orcamento>> GetClient(string cliente)
        {


            var a=  await _context.Orcamentos.AsNoTracking().Where(x => x.NomeCliente.Equals(cliente)).ToListAsync();
            return a[0];

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

                Orcamento o1 = new Orcamento()
                {
                    Observacoes = model.Observacoes,
                    ResponsavelOrcamento = model.ResponsavelOrcamento,
                    DataOrcamento = DateTime.UtcNow.AddHours(-3),
                    Acrescimo = model.Acrescimo,
                    Desconto = model.Desconto,
                    PrecoVendaTotal = model.PrecoVendaTotal,
                    IsPayed = false,
                    NomeCliente = model.NomeCliente,
                    CpfOrCnpj = model.CpfOrCnpj,
                    Empresa = model.Empresa,
                    EmailCliente = model.EmailCliente,
                    Endereco = model.Endereco,
                    Telefone = model.Telefone,
                    TipoPagamento = model.TipoPagamento,

            };

                await _context.Orcamentos.AddAsync(o1);

                await _context.SaveChangesAsync();

                return Ok(o1);




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
                var o1 = await _context.Orcamentos.FindAsync(id) ?? throw new KeyNotFoundException();

                o1.Observacoes = model.Observacoes;
                o1.Acrescimo = model.Acrescimo;
                o1.Desconto = model.Desconto;
                o1.PrecoVendaTotal = model.PrecoVendaTotal;
                o1.PrecoVendaComDesconto = model.PrecoVendaComDesconto;
                o1.IsPayed = model.IsPayed;
                o1.ResponsavelOrcamento = model.ResponsavelOrcamento;
                o1.NomeCliente = model.NomeCliente;
                o1.CpfOrCnpj = model.CpfOrCnpj;
                o1.Empresa = model.Empresa;
                o1.EmailCliente = model.EmailCliente;
                o1.Endereco = model.Endereco;
                o1.Telefone = model.Telefone;
                o1.TipoPagamento = model.TipoPagamento;

               

                _context.Orcamentos.Update(o1);

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
                        var inventario = inventarios.Where(x => x.MaterialId == item.MaterialId).ToList();


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

                var orcamento = await _context.Orcamentos.FindAsync(id) ?? throw new KeyNotFoundException();

                _context.Orcamentos.Remove(orcamento);

                await _context.SaveChangesAsync();

                return Ok();

            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }


        }
    }

}

