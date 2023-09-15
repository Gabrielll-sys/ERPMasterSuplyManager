using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;
using SupplyManager.Validations.MateriaisValidations;
using System.Net;
using System.Text.RegularExpressions;
using System.IO;

using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
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

        [HttpGet]
        ///<summary>
        ///Controlador para gerenciar as Categorias
        /// </summary>
        /// <returns>Todas os Materiais</returns>
        /// <response code="200">User found</response>
        /// <response code="404">User not found</response>
        /// <response code="500">Server Error</response>
        public async Task<ActionResult<List<Material>>> GetAll()
        {


            workbook = new XSSFWorkbook();

            var s1 = workbook.CreateSheet("Planilha 1");
            var materiais = await _context.Materiais.ToListAsync();
            /*
                        foreach( var mat in materiais )
                        {

                            for(int i = 1; i < 13; i++)
                            {

                                s1.CreateRow(i).CreateCell(i).SetCellValue(mat.Descricao);
                            }

                        }

                        workbook.Write(sw);
                        sw.Close();*/
            return materiais == null ? NotFound() : Ok(materiais);

        }


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
                return StatusCode(StatusCodes.Status400BadRequest);
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }


        }

        [HttpGet("buscaCodigo/{codigoInterno}")]
     

        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> GetLastMaterial(string codigoInterno)
        {

            try
            {
                var queryMaterial = from query in _context.Materiais select query;

                queryMaterial = queryMaterial.Where(x => x.CodigoInterno == codigoInterno).OrderBy(x => x.Id);
                /*  var material = await _context.Materiais.FindAsync(id);*/


                var material = await queryMaterial.ToListAsync();
                //Retornara o ultimo item da lista encontrado,no qual o ultimo que teve "atualização" no estoque saldo final etc
                return Ok(material[material.Count - 1]);

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
        [HttpGet(template: "buscaCategoria")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> Busca(string categoria)
        {


            try
            {
                List<Material> materiais = new List<Material>();
                List<string> codigos = new List<string>();

                var queryMaterial = from query in _context.Materiais select query;
           

                //Ordena a busca de materia
                queryMaterial =  queryMaterial.Where(c => c.Categoria.Contains(categoria));
                var v = queryMaterial.ToList();

                foreach (var item in v)
                {

                    if (!codigos.Contains(item.CodigoInterno) || !codigos.Contains(item.CodigoFabricante))
                    {

                        materiais.Add(item);
                        codigos.Add(item.CodigoInterno);
                        codigos.Add(item.CodigoFabricante);

                    }


                }



                return Ok(materiais);
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

        [HttpGet(template: "buscaInventario")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<Material>> BuscaDescricaoInventario(string descricao)
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
        [HttpGet(template: "buscaCodigoInterno")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult<Material>> BuscaCodigoInterno(string codigo)
        {

            try
            {

                var queryMaterial = from query in _context.Materiais select query;


                queryMaterial = queryMaterial.Where(x => x.CodigoInterno.Contains(codigo));

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
        [HttpGet(template: "buscaCodigoFabricante")]
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


                queryMaterial = queryMaterial.Where(x => x.CodigoFabricante.Contains(codigo));

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

                var checkFabricanteCode = await _context.Materiais.FirstOrDefaultAsync(x => x.CodigoFabricante == model.CodigoFabricante);

                //Caso ja exista o codigo e o estoque seja nulo,ou seja quando o usuario esta criando pela primeira vez, retornará que o codigo ja existe
                /*if (checkInternCode != null)
                {

                    return StatusCode(StatusCodes.Status400BadRequest, new { message = "Código interno já existe" });
                }
*/
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
                   model.DataEntradaNF
                   
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

            var a = queryMaterial.Where(x => x.CodigoFabricante == model.CodigoFabricante && x.Descricao == model.Descricao); ;

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
                        m1.DataEntradaNF = model.DataEntradaNF;

                    }

                    var updateMaterial = _context.Materiais.Update(m1);

                    await _context.SaveChangesAsync();

                    return Ok();
                }


                //CASO O MATERIAL TENHA SIDO CRIADO , TAMBEM SEU INVETÁRIO,ENTÃO FICARÁ VARIOS REGISTROS,ASSIM PEGARA TODOS OS ITENS DE INVENTÁRIO E TAMBEM
                // ATUALIZARÁ TODOS OS CAMPOS DESSES ITENS DE INVENTÁRIO

                foreach(var invetario in invetorys)
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
                        m1.DataEntradaNF = model.DataEntradaNF;

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
        /// 
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
