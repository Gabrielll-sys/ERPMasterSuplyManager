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
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class LogAcoesUsuarioController:ControllerBase
{
    private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;
    
    public LogAcoesUsuarioController(ILogAcoesUsuarioService logAcoesUsuarioService)
    {
        _logAcoesUsuarioService = logAcoesUsuarioService;
    }
    
    /// <summary>
    /// Busca todos os Logs
    /// </summary>
    /// <returns>Retorna todos Logs </returns>
    [HttpGet]
    [Authorize(Roles = "Diretor,Administrador")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.Forbidden)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    public async Task<ActionResult<List<LogAcoesUsuario>>> GetAll()
    {
           

        return Ok(await _logAcoesUsuarioService.GetAllAsync());
  

    }
    
    /// <summary>
    /// Busca todos os materiais
    /// </summary>
    /// <returns>Retorna todos Logs </returns>
    [HttpGet("buscaLogsByDate")]
    /*[Authorize(Roles = "Diretor")]*/
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.Forbidden)]
    [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
    public async Task<ActionResult<List<LogAcoesUsuario>>> GetLogsByDate(DateTime date)
    {
        var a = DateOnly.FromDateTime(date);

        var result = await _logAcoesUsuarioService.GetAllAsync();

        var r = result.Where(x => x.DataAcao is not null && x.DataAcao.Value.Date == date.Date).OrderByDescending(x=>x.DataAcao).ToList();

        return r;
    }
}