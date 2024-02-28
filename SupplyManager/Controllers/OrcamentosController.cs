using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SupplyManager.App;
using SupplyManager.Models;

namespace SupplyManager.Controllers
{
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
            return Ok(await _context.Orcamentos.FromSql($"SELECT * FROM Orcamentos ").ToListAsync());

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

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult<Venda>> Post([FromBody] Orcamento model)
        {
            try
            {

                Orcamento o1 = new Orcamento()
                {
                    Observacoes = model.Observacoes,
                    ReponsavelOrcamento = model.ReponsavelOrcamento,
                    DataOrcamento=model.DataOrcamento,
       
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

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] Orcamento model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var o1 = await _context.Orcamentos.FindAsync(id) ?? throw new KeyNotFoundException();

                o1.Observacoes = model.Observacoes;
                o1.ReponsavelOrcamento = model.ReponsavelOrcamento;
                o1.DataOrcamento = model.DataOrcamento;

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

