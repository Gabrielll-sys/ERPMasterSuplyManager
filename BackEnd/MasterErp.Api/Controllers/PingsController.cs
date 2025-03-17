using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using System.Net;
using MasterErp.Infraestructure;

namespace MasterErp.Api.Controllers;


    ///<summary>
    ///Controlador para gerencia unica e exclusivamente a rota de ping da aplicação,que é usada no azure function para evitar cold start da api
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class PingsController : ControllerBase
    {

        [HttpGet("Ping")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Forbidden)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]

        public async Task<ActionResult> Get()
        {
        return Ok();
        }    
        

    }

    

