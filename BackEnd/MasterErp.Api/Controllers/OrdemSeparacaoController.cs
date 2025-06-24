using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using System.Net;
using MasterErp.Infraestructure.Context;

namespace MasterErp.Api.Controllers;

    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class OrdemSeparacaoController:ControllerBase
    {

        private readonly SqlContext _context;

        public OrdemSeparacaoController(SqlContext context)
        {

            _context = context;
        }
        /// <summary>
        /// Busca todos as ordem de serviços
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Todos as ordem de serviços </returns>
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<List<OrdemSeparacao>> GetAll()
        {
    
            return await _context.OrdemSeparacoes.AsNoTracking().ToListAsync();
        }


        /// <summary>
        /// Busca uma ordem de serviço pelo seu Id
        /// </summary>
        /// <param name="id">O id da ordem de serviço</param>
        /// <returns>Ordem de serviço encontrada</returns>
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]


        public async Task<ActionResult<OrdemSeparacao>> Get(int id)
        {


            var a = await _context.OrdemSeparacoes.FirstOrDefaultAsync(x => x.Id == id);


            return Ok(a);



        }
        /// <summary>
        /// Cria um ordem serviço
        /// </summary>
        /// <param name="model">Um objeto que representa a ordem de serviço a ser criada</param>
        /// <returns>A ordem de serviço criada</returns>
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<OrdemSeparacao>> Create(OrdemSeparacaoDto model)
        {
            try
            {

                OrdemSeparacao o1 = new OrdemSeparacao
                {
                    Descricao = model.Descricao.ToUpper(),
                    Responsavel = model.Responsavel,
                    IsAuthorized = false,
                    DataAbertura = DateTime.UtcNow.AddHours(-3),
                  
                    Observacoes = model.Observacoes,
                };

                List<OrdemSeparacao> a = await _context.OrdemSeparacoes.ToListAsync();

            

          

                await _context.OrdemSeparacoes.AddAsync(o1);
             
                await _context.SaveChangesAsync();
       

                return Ok(o1);



            }


            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }





        }

        /// <summary>
        /// Atualizar a ordem de serviço, á autorizando
        /// </summary>
        /// <param name="id">O Id da ordem de serviço</param>
        /// <param name="model">O objeto de ordem de serviço a ser atualizada e autorizada </param>
        /// <returns></returns>


        [HttpPut("updateAuhorize/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult> UpdateAuthorize([FromRoute] int id, [FromBody] OrdemSeparacao model)
        {

            if (model.Id != id) return BadRequest();

            try
            {


                var itens = await _context.Itens.ToListAsync();

                var inventarios = await _context.Inventarios.ToListAsync();

                var OrdemSeparacao = await _context.OrdemSeparacoes.FirstOrDefaultAsync(x => x.Id == id);

                {
                   
                    OrdemSeparacao.PrecoCustoTotalOs = model.PrecoCustoTotalOs;
                    OrdemSeparacao.PrecoVendaTotalOs = model.PrecoVendaTotalOs;
                    OrdemSeparacao.DataFechamento = DateTime.UtcNow.AddYears(-3);

                }




                OrdemSeparacao.AutorizarOs();


                foreach (var item in itens)
                {
                    //Quando o item tiver o id da ordem de serviço a ser autorizada 
                    if(item.OrdemSeparacaoId == id)
                    {
                        //Busca o material presente no item para pegar a unidade 
                        var material = await _context.Materiais.FirstOrDefaultAsync(x => x.Id == item.MaterialId);

                    //Procura todos os inventários do material da tabela item,para posteriormente  subtrair do inventário a quantidade a ser utilizad na OS
                    List<Inventario> inventario = inventarios.Where(x => x.MaterialId == item.MaterialId).ToList();

                        
                        //Instacia um novo inventário para criar um novo inventário com a atualização de quantidade utilizada na os e o motivo,a descricação da os
                        Inventario i1 = new Inventario
                         (
                        OrdemSeparacao.Descricao,
                           inventario[inventario.Count-1].SaldoFinal,
                         inventario[inventario.Count - 1].Movimentacao,
                         inventario[inventario.Count - 1].SaldoFinal,
                         inventario[inventario.Count - 1].Responsavel,
                        item.MaterialId
                    );
                        //Formatara a string que aparece como a razao da movimentacão do inventário,caso OS seja da master elétrica,utilizará o próprio id
                        // D os como identificador pois no caso da master toda OS e sequencial,caso seja da brastorno será o numero deles ja vindo deles
                        string descricaoOsFormated =   $" {item.Quantidade} {material.Unidade} {(item.Quantidade > 1 ? "utilizadas" : "utilizada")} na {OrdemSeparacao.Descricao}" ;

                        i1.MovimentacaoOrdemSeparacao(item.Quantidade, descricaoOsFormated);

                        await _context.Inventarios.AddAsync(i1);
                    }

                }


                _context.OrdemSeparacoes.Update(OrdemSeparacao);
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

        /// <summary>
        /// Atualizar a ordem de serviço sem autoriza-la
        /// </summary>
        /// <param name="id">O Id da ordem de serviço</param>
        /// <param name="model">O objeto de ordem de serviço a ser atualizada</param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<OrdemSeparacao>> Update([FromRoute] int id, [FromBody] OrdemSeparacao model)
        {

            if (model.Id != id) return BadRequest();

            var a = await _context.OrdemSeparacoes.FirstOrDefaultAsync(x => x.Id == id);
            {
                a.Descricao = model.Descricao.ToUpper();
  
                a.Observacoes = model.Observacoes;

            }
            a.Descricao = "OS-" + id + "-" + model.Descricao;

            _context.OrdemSeparacoes.Update(a);
            await _context.SaveChangesAsync();

            return Ok();



        }


    }

