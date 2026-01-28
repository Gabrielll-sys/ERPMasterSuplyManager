using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using MasterErp.Infraestructure.Context;
using System.Security.Claims;
using MasterErp.Domain.Models.Pagination;

namespace MasterErp.Api.Controllers;
    ///<summary>
     ///Controlador para gerenciar Orçamentos
     /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
    public class OrcamentosController: ControllerBase
    {
        public readonly SqlContext _context;

        private readonly IOrcamentoService _orcamentoService;
        private readonly IOrcamentoPdfService _orcamentoPdfService;

        public OrcamentosController(SqlContext context, IOrcamentoService orcamentoService, IOrcamentoPdfService orcamentoPdfService)
        {

            _context = context;
            _orcamentoService = orcamentoService;
            _orcamentoPdfService = orcamentoPdfService;
        }



        [HttpGet]
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]


        public async Task<ActionResult<List<Orcamento>>> GetAll()
        {
       
            return Ok(await _orcamentoService.GetAllAsync());


        }

        [HttpGet("paged")]
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]
        public async Task<ActionResult<PagedResult<Orcamento>>> GetPaged([FromQuery] PaginationParams paginationParams)
        {
            try
            {
                var result = await _orcamentoService.GetPagedAsync(paginationParams);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet("buscaNomeCliente")]
        //         [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

        public async Task<ActionResult<List<Orcamento>>> GetByClientName(string cliente)
        {


            return await _orcamentoService.GetByClientName(cliente);

        }

        //Busca cliente,para caso exista,preencher automaticamente informações do cliente
        [HttpGet("buscaCliente")]
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

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
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

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

        [HttpGet("{id}/pdf")]
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]
        public async Task<IActionResult> GetPdf(int id)
        {
            try
            {
                var orcamento = await _context.Orcamentos.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
                if (orcamento == null) return NotFound();

                var itens = await _context.ItensOrcamento
                    .AsNoTracking()
                    .Include(x => x.Material)
                    .Where(x => x.OrcamentoId == id)
                    .OrderBy(x => x.Material != null ? x.Material.Descricao : string.Empty)
                    .ToListAsync();

                var nomeUsuario = User?.Identity?.Name ?? User?.FindFirstValue(ClaimTypes.Name);
                var pdfBytes = await _orcamentoPdfService.GenerateAsync(orcamento, itens, nomeUsuario);

                return File(pdfBytes, "application/pdf", $"orcamento-{id}.pdf");
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }
        }

    
        [HttpPost]
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

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
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

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
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

        public async Task<ActionResult> PutSell(int id, [FromBody] Orcamento model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var o1 = await _context.Orcamentos.FindAsync(id) ?? throw new KeyNotFoundException();

             

                var itens = await _context.ItensOrcamento.ToListAsync();

                var inventarios = await _context.Inventarios.ToListAsync();

                var orcamento = await _context.Orcamentos.FirstOrDefaultAsync(x => x.Id == id);
                if (orcamento == null) return NotFound();

                orcamento.DataVenda = DateTime.UtcNow.AddHours(-3);
                orcamento.IsPayed = true;

                // Fetch items WITH Materials to avoid N+1 in the loop
                var itensDoOrcamento = await _context.ItensOrcamento
                    .Where(x => x.OrcamentoId == id)
                    .ToListAsync();

                // Group inventarios by material to quickly get the last balance
                var materialIds = itensDoOrcamento.Select(i => i.MaterialId).Distinct().Cast<int?>().ToList();
                var lastInventarios = await _context.Inventarios
                    .Where(i => i.MaterialId.HasValue && materialIds.Contains(i.MaterialId))
                    .GroupBy(i => i.MaterialId)
                    .Select(g => g.OrderByDescending(x => x.Id).FirstOrDefault())
                    .ToListAsync();

                var inventarioMap = lastInventarios.ToDictionary(i => i.MaterialId);

                foreach (var item in itensDoOrcamento)
                {
                    if (inventarioMap.TryGetValue(item.MaterialId, out var lastInv))
                    {
                        Inventario i1 = new Inventario
                         (
                            $"Utilizado Orcamento Nº {orcamento.Id}",
                            lastInv.SaldoFinal,
                            lastInv.Movimentacao,
                            lastInv.SaldoFinal,
                            lastInv.Responsavel,
                            item.MaterialId
                        );

                        i1.MovimentacaoOrdemSeparacao((float)item.QuantidadeMaterial, $"Utilizado Orcamento Nº {orcamento.Id} De {orcamento.NomeCliente} ");

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
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]

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



