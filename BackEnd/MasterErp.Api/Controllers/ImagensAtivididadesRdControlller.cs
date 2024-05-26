using System.Net;
using Microsoft.AspNetCore.Mvc;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;

namespace MasterErp.Api.Controllers;

public class ImagensAtivididadesRdControlller:ControllerBase
{
    private readonly IImagemAtividadeRdService _imagemAtividadeRdService;
    
    public ImagensAtivididadesRdControlller( IImagemAtividadeRdService imagemAtividadeRdService)
    {
        _imagemAtividadeRdService = imagemAtividadeRdService;
    }
    
    
     /// <summary>
        /// Busca todos os as Imagens de das atividades
        /// </summary>
        /// <returns>Todos os materiais </returns>
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<List<ImagemAtividadeRd>>> GetAll()
        {
           

            return Ok(await _imagemAtividadeRdService.GetAllAsync());
  

        }

        /// <summary>
        /// Obtem material por id
        /// </summary>
        /// <param name="id">Id da imamgem de uma atividade</param>
        /// <returns>Materiais encontrado</returns>
        [HttpGet("{id}")]
     
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult<ImagemAtividadeRd>> GetByid(int id)
        {
            try
            {
        
                return Ok( await _imagemAtividadeRdService.GetByIdAsync(id));
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
        /// Criar novo Imagem de Um atividade de relatório diário
        /// </summary>
        /// <param name="id">Objeto material para ser criado</param>
        /// <returns>Materiais criado</returns>
        [HttpPost()]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> ImagemAtividadeRd([FromBody] ImagemAtividadeRd model)
        {

            try
            {
                var material = await _imagemAtividadeRdService.CreateAsync(model);
                
                return Ok(material);
                }
               


            
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }

        }
        /// <summary>
        /// Atualizar o ImagemAtividadeRd pelo Id
        /// </summary>
        /// <param name="id">O Id do material a ser atualizado</param>
        /// <param name="model">O objeto material a ser atualizado </param>
        /// <response code="200">ImagemAtividadeRd encontrado</response>
        /// <response code="400">Id do material não é valido</response>
        /// <response code="404">ImagemAtividadeRd não encontrado</response>
        /// <response code="500">Error no servidor</response>
        /// <returns>O material atualizado</returns>

        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> Update([FromRoute] int id, [FromBody] ImagemAtividadeRd model)
        {

            if (id != model.Id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var materialUpdated = await _imagemAtividadeRdService.UpdateAsync(model);
                
                return Ok(materialUpdated);

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
                await _imagemAtividadeRdService.DeleteAsync(id);
                
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