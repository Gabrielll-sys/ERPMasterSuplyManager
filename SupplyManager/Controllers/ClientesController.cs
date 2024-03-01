using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;
using System;

namespace SupplyManager.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ClientesController : ControllerBase
    {

        public readonly SqlContext _context;

        public ClientesController(SqlContext context)
        {

            _context = context;
        }

        

        [HttpGet]
        public async Task<ActionResult<List<Cliente>>> GetAll()
        {
            return Ok(await _context.Inventarios.FromSql($"SELECT * FROM Clientes ").ToListAsync());

        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> Get(int id)
        {
            try
            {
                return Ok(await _context.Clientes.FirstOrDefaultAsync(x => x.Id == id));


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
            public async Task<ActionResult<Cliente>> Post([FromBody] Cliente model)
        {
            try
            {

                    Cliente c1 = new Cliente()
                    {
                        Email = model.Email,
                        Nome = model.Nome,
                        Telefone = model.Telefone,
                        CPFOrCNPJ = model.CPFOrCNPJ,
                    };


                    var client = await _context.Clientes.AddAsync(c1);

                    await _context.SaveChangesAsync();


                    return Ok(client);

            }
                catch (Exception exception)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

                }

            }

    
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] Cliente model)
        {

                if(model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

                try
                {
                    var client = await _context.Clientes.FindAsync(id) ?? throw new KeyNotFoundException();

                    client.Email = model.Email;
                    client.Nome = model.Nome;
                    client.CPFOrCNPJ = model.CPFOrCNPJ;
                    client.Telefone = model.Telefone;

                     _context.Clientes.Update(client);

                    await _context.SaveChangesAsync();
                    return Ok();


                }

                catch(KeyNotFoundException)
                {
                    return StatusCode(StatusCodes.Status404NotFound);

                }
                catch (Exception exception)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

                }
            }

        
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
           try
            {
               var client = await _context.Clientes.FindAsync(id)?? throw new KeyNotFoundException();

               _context.Clientes.Remove(client);

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

