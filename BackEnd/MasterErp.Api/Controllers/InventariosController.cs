﻿
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using MasterErp.Domain.Validations.InventarioValidations;
using MasterErp.Infraestructure.Context;
namespace MasterErp.Api.Controllers;

///<summary>
///Controlador para gerenciar os Materias
/// </summary>
[ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class InventariosController : ControllerBase
    {
        private readonly SqlContext _context;
        private readonly IInventarioService _inventarioService;

        public InventariosController(SqlContext context,IInventarioService inventarioService)
        {
          
            _context = context;
            _inventarioService = inventarioService;

        }
        /// <summary>
        /// Busca todos os registros de inventários
        /// </summary>
        /// <returns>Todos os registros de inventário </returns>
        [HttpGet()]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<List<Inventario>>> GetAllInventarios()
        {
  
            try
            {

            var allItens = await _context.Inventarios.Include(x=>x.Material).AsNoTracking().ToListAsync();

            List<Inventario> result = new List<Inventario>();
            
                foreach (var i in allItens)
                {
                    var invetoryWithMaterial = allItens
                        .Where(x => x.MaterialId == i.MaterialId)
                        .TakeLast(1)
                        .ToList();

                    if (!result.Contains(invetoryWithMaterial[0]))
                    {

                    result.Add(invetoryWithMaterial[0]);

                    }

                }
            
                return Ok(result);
               
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
        /// <summary>
        /// Busca uma registro de inventário pelo seu Id
        /// </summary>
        /// <param name="id">O id do inventário</param>
        /// <returns>Inventário encontrado</returns>
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> GetInventario(int id)
        {

            try
            {

                var material = await _context.Inventarios.FindAsync(id);

                return Ok(material);
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
        /// <summary>
        /// Busca uma registro de inventário pelo seu Id
        /// </summary>
        /// <param name="id">O id do inventário</param>
        /// <returns>Inventário encontrado</returns>
        [HttpGet("getLastRegister/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> GetLastRegisterMaterial(int id)
        {

            try
            {
                var inventarios = await _context.Inventarios
                    .Include(x => x.Material)
                    .AsNoTracking()
                    .ToListAsync();

                var material =  inventarios
                    .Where(x=>x.MaterialId==id)
                    .TakeLast(1)
                    .ToList();

                return Ok(material[0]);
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
        //Metodo para trazer a lista de material e inventário junto
        /// <summary>
        /// Busca um material com os registros do seu invetário junto
        /// </summary>
        /// <param name="id">Id do material</param>
        /// <returns>Material junto com os registros de seu inventário</returns>
        [HttpGet("buscaCodigoInventario/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> BuscaCodigoInventario(int id)
        {


            try

            {

                var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == id);


                var listInvetory = await _context.Inventarios
                    .Where(x => x.MaterialId == id)
                    .Include(x => x.Material)
                    .ToListAsync();
                //Ordena a busca de materia






                return Ok(listInvetory);
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

        /// <summary>
        /// Filtro de materiais
        /// </summary>
        /// <param name="Filtro">Objeto contendo os valores para realizar a busca por filtro</param>
        /// <returns>Materiais de acordo com o filtro passado</returns>
        [HttpPost("filter-material")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> FilterSearch([FromBody] FilterMaterial model)
        {

            try
            {
                

                var queryMaterial = from query in _context.Materiais select query;

                //Caso tenha só tenha preço venda min

                if (
                   model.PrecoVendaMin.HasValue &&
                   !model.PrecoVendaMax.HasValue &&
                   !model.PrecoCustoMin.HasValue &&
                   !model.PrecoCustoMax.HasValue &&
           String.IsNullOrEmpty(model.Descricao) &&
           String.IsNullOrEmpty(model.Marca)


                    )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.PrecoVenda > model.PrecoVendaMin)
                        .OrderBy(x=>x.Material.PrecoVenda)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                    List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .OrderBy(x => x.Material.PrecoVenda)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }
                    return Ok(list);
                }

                //Caso tenha só tenha preço venda max
                if (
                    model.PrecoVendaMax.HasValue &&
                   !model.PrecoVendaMin.HasValue &&
                   !model.PrecoCustoMin.HasValue &&
                   !model.PrecoCustoMax.HasValue &&
                   String.IsNullOrEmpty(model.Descricao) &&
                   String.IsNullOrEmpty(model.Marca)

                    )
                {


                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.PrecoVenda < model.PrecoVendaMax)
                        .OrderByDescending(x => x.Material.PrecoVenda)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }


                //Caso tenha o preço de venda minimo e preço de venda máximo
                if (
                    model.PrecoVendaMax.HasValue &&
                    model.PrecoVendaMin.HasValue &&
                   !model.PrecoCustoMin.HasValue &&
                   !model.PrecoCustoMax.HasValue &&
                   String.IsNullOrEmpty(model.Descricao) &&
                   String.IsNullOrEmpty(model.Marca)

                    )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.PrecoVenda < model.PrecoVendaMax && x.Material.PrecoVenda > model.PrecoVendaMin)
                        .OrderBy(x => x.Material.PrecoVenda)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha somente preço de custo minímo

                if (
                   !model.PrecoVendaMax.HasValue &&
                   !model.PrecoVendaMin.HasValue &&
                   model.PrecoCustoMin.HasValue &&
                   !model.PrecoCustoMax.HasValue &&
                   String.IsNullOrEmpty(model.Descricao) &&
                   String.IsNullOrEmpty(model.Marca)

                    )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.PrecoCusto > model.PrecoCustoMin)
                        .OrderBy(x => x.Material.PrecoCusto)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso senha somente preço custo max
                if (
                   !model.PrecoVendaMax.HasValue &&
                   !model.PrecoVendaMin.HasValue &&
                   !model.PrecoCustoMin.HasValue &&
                   model.PrecoCustoMax.HasValue &&
                   String.IsNullOrEmpty(model.Descricao) &&
                   String.IsNullOrEmpty(model.Marca)

                    )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.PrecoCusto < model.PrecoCustoMax)
                        .OrderByDescending(x => x.Material.PrecoCusto)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }


                //Caso tenha preço custo min e preço custo max

                if (
                   !model.PrecoVendaMax.HasValue &&
                   !model.PrecoVendaMin.HasValue &&
                   model.PrecoCustoMin.HasValue &&
                   model.PrecoCustoMax.HasValue &&
                   String.IsNullOrEmpty(model.Descricao) &&
                   String.IsNullOrEmpty(model.Marca)

                    )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.PrecoCusto < model.PrecoCustoMax && x.Material.PrecoCusto > model.PrecoCustoMin)
                        .OrderBy(x => x.Material.PrecoCusto)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                // Caso tenha SOMENTE descricao

                if (
                   !model.PrecoVendaMax.HasValue &&
                   !model.PrecoVendaMin.HasValue &&
                   !model.PrecoCustoMin.HasValue &&
                   !model.PrecoCustoMax.HasValue &&
                   !String.IsNullOrEmpty(model.Descricao) &&
                   String.IsNullOrEmpty(model.Marca)

                    )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao))
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/

                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);
                         

                        }

                    }

                    return Ok(list);
                }
                //Caso tenha somente marca
                if (
                  !model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                  String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Marca.Contains(model.Marca))
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha descricão e marca
                if (
                  !model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao) &&  x.Material.Marca.Contains(model.Marca))
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha marca e preço custo min
                if (
                  !model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                   model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                   String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x =>   x.Material.Marca.Contains(model.Marca) && x.Material.PrecoCusto > model.PrecoCustoMin)
                        .OrderBy(x => x.Material.PrecoCusto)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha marca e preço custo max
                if (
                  !model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                   model.PrecoCustoMax.HasValue &&
                   String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Marca.Contains(model.Marca) && x.Material.PrecoCusto < model.PrecoCustoMax)
                        .OrderByDescending(x => x.Material.PrecoCusto)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha marca e preço custo min preço custo max
                if (
                  !model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                   model.PrecoCustoMin.HasValue &&
                   model.PrecoCustoMax.HasValue &&
                   String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)

                        .Where(x => x.Material.Marca.Contains(model.Marca) && x.Material.PrecoCusto > model.PrecoCustoMin && x.Material.PrecoCusto < model.PrecoCustoMax)
                        .OrderBy(x => x.Material.PrecoCusto)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }



                //Caso tenha marca e preço venda min
                if (
                  !model.PrecoVendaMax.HasValue &&
                   model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                   String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Marca.Contains(model.Marca) && x.Material.PrecoVenda> model.PrecoVendaMin)
                        .OrderBy(x => x.Material.PrecoVenda)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha marca e preço venda max
                if (
                   model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                   String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Marca.Contains(model.Marca) && x.Material.PrecoVenda < model.PrecoVendaMax)
                        .OrderByDescending(x => x.Material.PrecoVenda)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha marca e preço venda min e max
                if (
                   model.PrecoVendaMax.HasValue &&
                   model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                  String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Marca.Contains(model.Marca) && x.Material.PrecoVenda > model.PrecoVendaMin 
                        && x.Material.PrecoVenda < model.PrecoVendaMax)
                        .OrderBy(x=>x.Material.PrecoVenda)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha descricão e preço venda minímo
                if (
                  !model.PrecoVendaMax.HasValue &&
                   model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao) && x.Material.PrecoVenda > model.PrecoVendaMin)
                        .OrderBy(x => x.Material.PrecoVenda)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha descricão e preço venda máximo  
                if (
                   model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao) && x.Material.PrecoVenda < model.PrecoVendaMax )
                        .OrderByDescending(x => x.Material.PrecoVenda)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }


                //Caso tenha descricão e preço venda minímo e preço venda máximo    
                if (
                   model.PrecoVendaMax.HasValue &&
                   model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  String.IsNullOrEmpty(model.Marca)

                   )
                {

                   var filterResult = await _context.Inventarios
                       .Include(s => s.Material)
                       .Where(x => x.Material.Descricao.Contains(model.Descricao) && x.Material.PrecoVenda > model.PrecoVendaMin && x.Material.PrecoVenda < model.PrecoVendaMax)
                       .OrderBy(x => x.Material.PrecoVenda)
                       .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha descricão e preço custo minímo 
                if (
                  !model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                   model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao) && x.Material.PrecoCusto > model.PrecoCustoMin)
                        .OrderBy(x => x.Material.PrecoCusto)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha descricão e preço custo max
                if (
                  !model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                   model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao) && x.Material.PrecoCusto < model.PrecoCustoMax)
                        .OrderByDescending(x => x.Material.PrecoCusto)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha descricão e preço custo min e preço custo máximo
                if (
                  !model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                   model.PrecoCustoMin.HasValue &&
                   model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao) && x.Material.PrecoCusto > model.PrecoCustoMin && x.Material.PrecoCusto < model.PrecoCustoMax)
                        .OrderBy(x => x.Material.PrecoCusto)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha descricão e marca e preço custo min
                if (
                  !model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                   model.PrecoCustoMin.HasValue &&
                   model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao) && x.Material.Marca.Contains(model.Marca) 
                        && x.Material.PrecoCusto > model.PrecoCustoMin)
                        .OrderBy(x => x.Material.PrecoCusto)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*          Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha descricão e marca e preço custo min e preço custo max
                if (
                  !model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                   model.PrecoCustoMin.HasValue &&
                   model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao) && x.Material.Marca.Contains(model.Marca)
                        && x.Material.PrecoCusto > model.PrecoCustoMin && x.Material.PrecoCusto < model.PrecoCustoMax)
                        .OrderBy(x => x.Material.PrecoCusto)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*       Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                
                }

                //Caso tenha descricão e marca e preço venda min
                if (
                  !model.PrecoVendaMax.HasValue &&
                   model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao) && x.Material.Marca.Contains(model.Marca)
                        && x.Material.PrecoVenda > model.PrecoVendaMin )
                        .OrderBy(x => x.Material.PrecoVenda)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*       Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha descricão e marca  e preço venda max
                if (
                   model.PrecoVendaMax.HasValue &&
                  !model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao) && x.Material.Marca.Contains(model.Marca)
                        && x.Material.PrecoVenda < model.PrecoVendaMax)
                        .OrderByDescending(x => x.Material.PrecoVenda)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*       Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }

                //Caso tenha descricão e marca e preço venda min e preço venda max
                if (
                   model.PrecoVendaMax.HasValue &&
                   model.PrecoVendaMin.HasValue &&
                  !model.PrecoCustoMin.HasValue &&
                  !model.PrecoCustoMax.HasValue &&
                  !String.IsNullOrEmpty(model.Descricao) &&
                  !String.IsNullOrEmpty(model.Marca)

                   )
                {

                    var filterResult = await _context.Inventarios
                        .Include(s => s.Material)
                        .Where(x => x.Material.Descricao.Contains(model.Descricao) && x.Material.Marca.Contains(model.Marca)
                        && x.Material.PrecoVenda > model.PrecoVendaMin && x.Material.PrecoVenda < model.PrecoVendaMax)
                        .OrderBy(x => x.Material.PrecoVenda)
                        .ToListAsync();

                    List<Inventario> list = new List<Inventario>();

                    /*       Após o filtro ser feito,ira realizar outro filtro agora no resultado
                              de inventários,para pegar somente o ultimo registro de movimentação de inventário daquele material*/
                    foreach (var item in filterResult)
                    {
                        List<Inventario> inventario = filterResult
                            .Where(x => x.MaterialId == item.MaterialId)
                            .ToList();

                        if (!list.Contains(inventario[inventario.Count - 1]))
                        {
                            list.Add(inventario[inventario.Count - 1]);


                        }

                    }

                    return Ok(list);
                }



                return Ok();

            }


            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }


        }



        /// <summary>
        /// Busca materiais pelo código do fabricante
        /// </summary>
        /// <param name="id">Código do fabricante</param>
        /// <returns>Materiais de acordo com o código do fabricante passado</returns>
        [HttpGet("buscaCodigoFabricante")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> BuscaCodigoFabricante(string codigo)
        {


            try
            {
                var queryMaterial = from query in _context.Materiais select query;
                var queryInvetory = await _context.Inventarios.ToListAsync();
                List<Inventario> listInvetory = new List<Inventario>();


                //Realiza uma busca no banco de materias para buscar match na descrição de acordo com a busca
                queryMaterial = queryMaterial
                    .Where(x => x.CodigoFabricante.Contains(codigo))
                    .OrderBy(x => x.Id);

                var materiais = await queryMaterial.ToListAsync();
                //Faz um iteração em todos os materiais com aquela descrição
              foreach (var item in materiais)
                {
                    //Realiza um filtro buscando todos os invetários daquele material,ou seja,retornara todos os registros de invetário daquele produto
                    List<Inventario> inventarios = queryInvetory
                        .Where(x => x.MaterialId == item.Id)
                        .ToList();


                    var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == inventarios[0].MaterialId);


                    inventarios[inventarios.Count - 1].Material = material;



                    listInvetory.Add(inventarios[inventarios.Count - 1]);





                }
              
                return Ok(listInvetory);
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
        /// <summary>
        /// Busca materiais descrição passada
        /// </summary>
        /// <param name="id">A descrição do(s) material(is) a serem encontrados</param>
        /// <returns>Materiais com a descrição encontrados</returns>
        [HttpGet(template: "buscaDescricaoInventario")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<List<Inventario>>> BuscaDescricaoInventario(string descricao)
        {


            try
            {
                var queryMaterial = await _context.Materiais
                    .AsNoTracking()
                    .ToListAsync();
            
                var queryInvetory = await _context.Inventarios
                    .AsNoTracking()
                    .Include(x=>x.Material)
                    .ToListAsync();



                List<Inventario> listInvetory = new List<Inventario>(); 

                List<Material> l1 = new List<Material>();
                //Realiza um split para separar a string em array de strings pelo ., e depois filtra para não incluir vazio
                string[] splited = descricao
                    .Split(".")
                    .Where(x => x != "")
                    .ToArray();

       
                //Caractere que ira dividir a busca de string e ira realiza sub buscar de acordo com as string separadas pelo delimitador .
               if (descricao.Contains("."))
                {

                        if(splited.Length is 1)
                    {
                        l1 = queryMaterial.Where(x => x.Descricao.Contains(splited[0].ToUpper())).OrderBy(x => x.Id).ToList();
                        
                    }
                   
                    if (splited.Length is 2)
                    {
                        l1 = queryMaterial.Where(x => x.Descricao.Contains(splited[0].ToUpper())
                        && x.Descricao.Contains(splited[1].ToUpper())).OrderBy(x => x.Id).ToList();
                    }
                    if (splited.Length is 3)
                    {
                         l1 =  queryMaterial.Where(x => x.Descricao.Contains(splited[0].ToUpper())
                          && x.Descricao.Contains(splited[1].ToUpper())
                            && x.Descricao.Contains(splited[2].ToUpper())).OrderBy(x => x.Id).ToList();

                    } 
                    if (splited.Length is 4)
                    {
                         l1 =  queryMaterial.Where(x => x.Descricao.Contains(splited[0].ToUpper()   )
                          && x.Descricao.Contains(splited[1].ToUpper())
                            && x.Descricao.Contains(splited[2].ToUpper())
                            && x.Descricao.Contains(splited[3].ToUpper())).OrderBy(x => x.Id).ToList();

                    }


                }
                else
                {

                    if(string.Equals(descricao,"tudo",StringComparison.OrdinalIgnoreCase))
                    {
                       queryMaterial = queryMaterial
                            .OrderByDescending(x => x.Id)
                            .ThenBy(x => x.PrecoCusto)
                            .ToList();
    
                    }
                    else
                    {

                        queryMaterial = queryMaterial
                            .Where(x => x.Descricao.Contains(descricao.ToUpper()))
                            .ToList();
                      

                    }
                
                    l1 = queryMaterial;

                }

                //Faz um iteração em todos os materiais com aquela descrição
                foreach(var item in l1)
                {
                    //Realiza um filtro para buscar o ultimo registro de inventário daquele material
                  
                    List<Inventario> inventarios = queryInvetory
                        .Where(x => x.MaterialId == item.Id)
                        .OrderBy(x=>x.MaterialId)
                        .TakeLast(1)
                        .ToList();

                    if (inventarios.Count is not 0)
                    {

                    listInvetory.Add(inventarios[0]);
                    }

           

                }

               return Ok( listInvetory);
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
        /// <summary>
        /// Cria um novo registro de inventário de um determinado material
        /// </summary>
        /// <param name="inventario">Objeto de material</param>
        /// <returns>Inventário criado</returns>
        [HttpPost()]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> CreateInvetario([FromBody] Inventario model)
        {

            try
            {
               List<Inventario>queryMaterial = await _context.Inventarios.ToListAsync();


                List<Inventario >b= queryMaterial
                    .Where(x => x.MaterialId == model.MaterialId)
                    .OrderBy(x => x.Id).ToList();

        

                //CASO SEJA O PRIMEIRO ITEM DO INVENTÁRIO OU QUANDO FOR CRIAR DE FATO O SEGUNDO ITEM
                if (b.Count == 0 || b.Count == 1)
                {
         

                    Inventario invetory1 = new Inventario
                        (
                        model.Razao,
                        0,
                        model.Movimentacao,
                        model.SaldoFinal,
                        model.Responsavel,
                        model.MaterialId
                        );


                    invetory1.EstoqueMovimentacao(model.SaldoFinal);
                    await _context.Inventarios.AddAsync(invetory1);



                    await _context.SaveChangesAsync();

                    return Ok(invetory1);

                }
                
                Inventario i1 = new Inventario
                    (
                    model.Razao,
                    model.Estoque,
                    model.Movimentacao,
                    model.SaldoFinal,
                    model.Responsavel,
                    model.MaterialId
                    );

                var a = i1.EstoqueMovimentacao(model.SaldoFinal);



                await _context.Inventarios.AddAsync(i1);



                await _context.SaveChangesAsync();

                return Ok(i1);


            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }

        }
        /// <summary>
        /// Remove uma quantidade provinda da page de encanear qrcode para material
        /// </summary>
        /// <param name="inventário">Objeto de inventário</param>
        /// <returns>Inventário criado,após remoção da quantidade do estoque</returns>
        [HttpPost("remove_from_qr_code")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult>RemoverQuantidadeInventario ([FromBody] Inventario model)
        {

            try
            {

                Inventario i1 = new Inventario
                    (
                    model.Razao,
                    model.Estoque,
                    model.Movimentacao,
                    model.SaldoFinal,
                    model.Responsavel,
                    model.MaterialId
                    );

                await _context.Inventarios.AddAsync(i1);



                await _context.SaveChangesAsync();

                return Ok(i1);


            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }

        }
        /// <summary>
        /// Atualizar o Material pelo Id
        /// </summary>
        /// <param name="id">O Id do material a ser atualizado</param>
        /// <param name="model">O objeto material a ser atualizado </param>
        /// <response code="200">Material encontrado</response>
        /// <response code="400">Id do material não é valido</response>
        /// <response code="404">Material não encontrado</response>
        /// <response code="500">Error no servidor</response>
        /// <returns>O material atualizado</returns>

        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> PutInventario([FromRoute] int id, [FromBody] Inventario model)
        {

            if (id != model.Id) return StatusCode(StatusCodes.Status400BadRequest);

            var queryInventario = from query in _context.Inventarios select query;

            try
            {


                var m1 = await _context.Inventarios.FindAsync(model.Id);

                {



                }

                _context.Inventarios.Update(m1);

                await _context.SaveChangesAsync();



                return Ok();


            }
            catch (KeyNotFoundException exception)
            {

                return StatusCode(StatusCodes.Status404NotFound, exception.Message);
            }




        }
        /// <summary>
        /// Deleta o material pelo id fornecido
        /// </summary>
        /// <param name="id"> O id do material a ser deletado</param>
        /// <returns></returns>

        [HttpDelete("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                InventarioIdValidator m1 = new InventarioIdValidator();

                var inventarioValidation = m1.Validate(id);


                if (!inventarioValidation.IsValid)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { message = inventarioValidation.Errors });
                }

                var inventario = await _context.Inventarios.FindAsync(id);

                _context.Inventarios.Remove(inventario);


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
        [HttpPost("populate")]

        public async Task PopulateDb()
        {


            var queryMaterialWithNoInvetory = await _context.Materiais.ToListAsync();



            foreach (var material in queryMaterialWithNoInvetory)
            {
                var findInvetory = await _context.Inventarios.FirstOrDefaultAsync(x => x.MaterialId == material.Id);


                if (findInvetory == null)
                {
                    Inventario inventario = new Inventario
                      (
                      null,
                      0,
                      null,
                      null,
                      null,
                      material.Id
                      );



                    await _context.Inventarios.AddAsync(inventario);






                }


            }

            await _context.SaveChangesAsync();


        }
    }




        
    
