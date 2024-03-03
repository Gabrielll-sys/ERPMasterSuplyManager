using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using System.Net;

namespace SupplyManager.Controllers
{
    ///<summary>
    ///Controlador para gerenciar os Fornecedores
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class FornecedoresController:ControllerBase
    {
        private readonly SqlContext _context;

        public FornecedoresController(SqlContext context)
        {
            _context = context;
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<List<Fornecedor>>> GetAll()
        {
            try
            {
                return await _context.Fornecedores.AsNoTracking().ToListAsync();
            }

           
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }      
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<Fornecedor>> GetById(int id)
        {
            try
            {
                return await _context.Fornecedores.FirstOrDefaultAsync(x => x.Id==id); ;
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
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<Fornecedor>> Put([FromBody] Fornecedor model)
        {
            try
            {
                Fornecedor f1 = new Fornecedor()
                {
                    Nome = model.Nome,
                    Endereco = model.Endereco,
                    Bairro = model.Bairro,
                    Cep = model.Cep,
                    Cidade = model.Cidade,
                    Estado = model.Estado,
                    Numero = model.Numero,
                    Telefone = model.Telefone,

                };

                var fornecedor = await _context.Fornecedores.AddAsync(f1);
                await _context.SaveChangesAsync();
                return Ok(fornecedor);


            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult> Put([FromBody] Fornecedor model, [FromRoute] int id)
        {
            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {

                Fornecedor f1 = await _context.Fornecedores.FindAsync(id) ?? throw new KeyNotFoundException();
                {
                    f1.Cidade = model.Cidade;
                    f1.Bairro = model.Bairro;
                    f1.Estado = model.Estado;
                    f1.Numero = model.Numero;
                    f1.Telefone = model.Telefone;
                    f1.Nome = model.Nome;
                    f1.Cep = model.Cep;
                    f1.Endereco = model.Endereco;




                };



                _context.Fornecedores.Update(f1);
                await _context.SaveChangesAsync();

                return Ok();

            }

            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

        [HttpDelete]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult> Delete(int id)
        {

            try
            {
                var fornecedor = await _context.Fornecedores.FindAsync(id)?? throw new KeyNotFoundException();
                _context.Fornecedores.Remove(fornecedor);
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
