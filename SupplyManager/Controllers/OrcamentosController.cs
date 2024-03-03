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
            return Ok(await _context.Orcamentos.AsNoTracking().OrderBy(x=>x.DataOrcamento).ToListAsync());

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
                    DataOrcamento = model.DataOrcamento,
                    Acrescimo = model.Acrescimo,
                    Desconto = model.Desconto,
                    PrecoTotal = model.PrecoTotal,
                    IsPayed = false,
                    DataVenda = model.DataVenda,
                    NomeCliente = model.NomeCliente,
                    CPFOrCNPJ = model.CPFOrCNPJ,
                    Empresa = model.Empresa,
                    EmailCliente = model.EmailCliente,
                    Endereço = model.Endereço,
                    Telefone = model.Telefone,
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
                o1.PrecoTotal = model.PrecoTotal;
                o1.IsPayed = model.IsPayed;
                o1.ResponsavelOrcamento = model.ResponsavelOrcamento;
                o1.DataOrcamento = model.DataOrcamento;
                o1.NomeCliente = model.NomeCliente;
                o1.CPFOrCNPJ = model.CPFOrCNPJ;
                o1.Empresa = model.Empresa;
                o1.EmailCliente = model.EmailCliente;
                o1.Endereço = model.Endereço;
                o1.Telefone = model.Telefone;
               

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

