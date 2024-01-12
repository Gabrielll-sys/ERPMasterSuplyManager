using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;
using SupplyManager.Validations.MateriaisValidations;
using System.Net;
using System.Text.RegularExpressions;
using System.IO;
using SupplyManager.Extensions;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System.ComponentModel;
using System.Linq;

namespace SupplyManager.Controllers
{

    ///<summary>
    ///Controlador para gerenciar os Materias
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class MateriaisController : ControllerBase
    {
        private readonly SqlContext _context;
        IWorkbook workbook;




        public MateriaisController(SqlContext context)
        {

            _context = context;
        }

        /// <summary>
        /// Busca todos os materiais
        /// </summary>
        /// <returns>Todos os materiais </returns>
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<List<Material>>> GetAll()
        {


            workbook = new XSSFWorkbook();

            var s1 = workbook.CreateSheet("Planilha 1");
            var materiais = await _context.Materiais.ToListAsync();
          
            return materiais == null ? NotFound() : Ok(materiais);

        }

        /// <summary>
        /// Obtem material por id
        /// </summary>
        /// <param name="id">Id do material para ser obtido</param>
        /// <returns>Materiais encontrado</returns>
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> GetMaterial(int id)
        {

            try
            {
                var queryMaterial = from query in _context.Materiais select query;


                var material = await _context.Materiais.FindAsync(id);

                return Ok(material);
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
        /// <summary>
        /// Obtem material com o ultimo registro de seu inventário
        /// </summary>
        /// <param name="id">Id do material</param>
        /// <returns>Material e inventário encontrado</returns>
        [HttpGet("getMaterialWithInvetory/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> GetMaterialwithInvetory(int id)
        {

            try
            {
                var materialWithInventory = await _context.Inventarios.Include(s => s.Material).Where(x =>x.MaterialId==id).ToListAsync();

                return Ok(materialWithInventory[materialWithInventory.Count-1]);

             

      
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
        

  
        /// <summary>
        /// Busca materiais com a descrição
        /// </summary>
        /// <param name="id">A descrição do material</param>
        /// <returns>Materiais encontrados com a descrição passado</returns>
        [HttpGet(template: "buscaDescricao")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> BuscaDescricao(string descricao)
        {


            try
            {
                var queryMaterial = from query in _context.Materiais select query;


                //Ordena a busca de materia

                queryMaterial = queryMaterial.Where(x => x.Descricao.Contains(descricao)).OrderBy(x => x.Id);


                return Ok(await queryMaterial.ToListAsync());
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
        /// Criar novo material
        /// </summary>
        /// <param name="id">Objeto material para ser criado</param>
        /// <returns>Materiais criado</returns>
        [HttpPost()]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> CreateMaterial([FromBody] Material model)
        {

            try
            {
                var queryMaterial = from query in _context.Materiais select query;

                MateriaisPostValidator ValidationMaterial = new MateriaisPostValidator();

                //Verifica se o modelo o código digitado do material já existe,caso sim,retornara bad request e uma mensagem de material já existe
                var checkInternCode = await _context.Materiais.FirstOrDefaultAsync(x => x.CodigoInterno == model.CodigoInterno);
                //Busca codigo do fabricante para ver se ja possui ,e tambem poe uma condição para caso seja diferente de vazio,pois a criação de material pode ter o código vazio
                var checkFabricanteCode = await _context.Materiais.FirstOrDefaultAsync(x => x.CodigoFabricante == model.CodigoFabricante  &&  model.CodigoFabricante!="");

                

                if (checkFabricanteCode != null)
                {

                    return StatusCode(StatusCodes.Status400BadRequest, new { message = "Código de fabricante já existe" });
                }

                queryMaterial = queryMaterial.Where(x => x.CodigoInterno == model.CodigoInterno);

                var AlredyHaveMaterial = await queryMaterial.ToListAsync();

                

                    Material m1 = new Material(
                  model.CodigoInterno.ToUpper(),
                  model.CodigoFabricante.ToUpper(),
                  model.Descricao.ToUpper(),
                  model.Categoria.ToUpper(),
                  model.Marca.ToUpper(),
                  String.IsNullOrEmpty(model.Corrente) ? "-" : model.Corrente.ToUpper(),
                  model.Unidade,
                  String.IsNullOrEmpty(model.Tensao) ? "-" : model.Tensao,
                  String.IsNullOrEmpty(model.Localizacao) ? "-" : model.Localizacao.ToUpper(),

                   model.DataEntradaNF,
                   model.PrecoCusto,
                   model.Markup
                  
                  
                   
                   );
                    var validationM1 = ValidationMaterial.Validate(m1);

                    if (!validationM1.IsValid)
                    {

                        return StatusCode(StatusCodes.Status400BadRequest, new { message = validationM1.Errors });
                    };

                    await _context.Materiais.AddAsync(m1);



                await _context.SaveChangesAsync();

                return Ok(m1);
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
        public async Task<ActionResult> PutMaterial([FromRoute] int id, [FromBody] Material model)
        {

            if (id != model.Id) return StatusCode(StatusCodes.Status400BadRequest);

            var queryMaterial = from query in _context.Materiais select query;

            var a = queryMaterial.Where(x => x.CodigoFabricante == model.CodigoFabricante && x.Descricao == model.Descricao); 

            var invetorys = await a.ToListAsync();


            try
            {

                if (invetorys.Count == 0)
                {
                    MaterialIdValidator material = new MaterialIdValidator();

                    var materialValidation = material.Validate(id);


                    var m1 = await _context.Materiais.FindAsync(model.Id);

                    {
                        m1.CodigoInterno = model.CodigoInterno.ToUpper();
                        m1.CodigoFabricante = model.CodigoFabricante.ToUpper();
                        m1.Descricao = model.Descricao.ToUpper();
                        m1.Categoria = model.Categoria.ToUpper();
                        m1.Marca = model.Marca.ToUpper();
                        m1.Corrente = model.Corrente.ToUpper();
                        m1.Unidade = model.Unidade.ToUpper();
                        m1.Tensao = String.IsNullOrEmpty(model.Tensao) ? "-" : model.Tensao;
                        m1.Localizacao = String.IsNullOrEmpty(model.Localizacao) ? "-" : model.Localizacao.ToUpper();
                        m1.DataEntradaNF = model.DataEntradaNF;
                        m1.PrecoCusto =  model.PrecoCusto;
                        m1.PrecoVenda = model.PrecoVenda;

                        m1.Markup = model.Markup;


                    }

                   
              

                    m1.CalcularPrecoVenda();

                    


                    if (m1.PrecoCusto == 0)
                    {
                        m1.PrecoVenda = 0;
                    }

                    var updateMaterial = _context.Materiais.Update(m1);

                    await _context.SaveChangesAsync();

                    return Ok();
                }


                //CASO O MATERIAL TENHA SIDO CRIADO , TAMBEM SEU INVETÁRIO,ENTÃO FICARÁ VARIOS REGISTROS,ASSIM PEGARA TODOS OS ITENS DE INVENTÁRIO E TAMBEM
                // ATUALIZARÁ TODOS OS CAMPOS DESSES ITENS DE INVENTÁRIO

                foreach (var invetario in invetorys)
                {
                    var m1 = await _context.Materiais.FindAsync(invetario.Id);
                    

                    {

                        m1.CodigoFabricante = model.CodigoFabricante.ToUpper();
                        m1.Descricao = model.Descricao.ToUpper();
                        m1.Categoria = model.Categoria.ToUpper();
                        m1.Marca = model.Marca.ToUpper();
                        m1.Corrente = model.Corrente.ToUpper();
                        m1.Unidade = model.Unidade.ToUpper();
                        m1.Tensao = String.IsNullOrEmpty(model.Tensao) ? "-" : model.Tensao;
                        m1.Localizacao = String.IsNullOrEmpty(model.Localizacao) ? "-" : model.Localizacao.ToUpper();
                        m1.DataEntradaNF = model.DataEntradaNF;
                        m1.PrecoCusto =  model.PrecoCusto;
                        m1.PrecoVenda =  model.PrecoVenda;
                        m1.Markup = model.Markup;

                    }

                  
            
                    m1.CalcularPrecoVenda();
                    


        
                    if (m1.PrecoCusto == 0)
                    {
                        m1.PrecoVenda = 0;
                    }                    

                    var updateMaterial = _context.Materiais.Update(m1);

                    await _context.SaveChangesAsync();


                }
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
                MaterialIdValidator m1 = new MaterialIdValidator();

                var materialValidation = m1.Validate(id);


                if (!materialValidation.IsValid)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { message = materialValidation.Errors });
                }

                var material = await _context.Materiais.FindAsync(id);

                _context.Materiais.Remove(material);


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

    }
}
