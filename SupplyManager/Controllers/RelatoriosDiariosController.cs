using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SupplyManager.Models;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using SupplyManager.App;
using Microsoft.IdentityModel.Tokens;
using NPOI.SS.Formula.Functions;
using SupplyManager.Interfaces;
using SupplyManager.Services;

namespace SupplyManager.Controllers;

public class RelatoriosDiariosController:ControllerBase
{
    private readonly IRelatorioDiarioService _relatorioDiarioService;
    
    public RelatoriosDiariosController( IRelatorioDiarioService relatorioDiarioService)
    {
        _relatorioDiarioService = relatorioDiarioService;
    }
    
     /// <summary>
        /// Realiza a criação de usuário no Sistema
        /// </summary>
        /// <param name="Usuario"></param>
        /// <returns>O Usuário Criado </returns>
        /// 
        [HttpPost]
        /*[Authorize(Roles = "Diretor")]*/
        public async Task<ActionResult> Post([FromBody] RelatorioDiario model)
        {
            try
            {
                
                var rd = await _relatorioDiarioService.CreateAsync(model);
                

                return Ok(rd);

            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }

        }

        /// <summary>
        /// Atualiza um Relatório Diario
        /// </summary>
        /// <param name="Relatorio Diário"></param>
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] RelatorioDiario model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var rd = await _relatorioDiarioService.UpdateAsync(model);

                return Ok(rd);


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