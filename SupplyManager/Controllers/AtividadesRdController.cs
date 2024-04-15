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
using SupplyManager.Interfaces;
using Microsoft.AspNetCore.Authorization;
using MySqlConnector;
using SupplyManager.Services;

namespace SupplyManager.Controllers;

public class AtividadesRdController:ControllerBase
{
    private readonly IAtividadeRdService _atividadesRdService;


    public AtividadesRdController(IAtividadeRdService atividadesRdService)
    {
        _atividadesRdService = atividadesRdService;
    }
     [HttpGet]
    public async Task<ActionResult<List<AtividadeRd>>> GetAll()
    {
       
        return Ok(await _atividadesRdService.GetAllAsync());


    }
    

 
    [HttpGet("{id}")]
    public async Task<ActionResult<AtividadeRd>> Get(int id)
    {
        try
        {
            return Ok(await _atividadesRdService.GetByIdAsync(id));

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
        /// Cria um relatório diário
        /// </summary>
        /// <param name="Usuario"></param>
        /// <returns>O Relatorio Diario Criado </returns>
        /// 
        [HttpPost]
        /*[Authorize(Roles = "Diretor")]*/
        public async Task<ActionResult> Post([FromBody] AtividadeRd model)
        {
            try
            {
                
                var rd = await _atividadesRdService.CreateAsync(model);
                

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
        public async Task<ActionResult> Put(int id, [FromBody] AtividadeRd model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var rd = await _atividadesRdService.UpdateAsync(model);

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