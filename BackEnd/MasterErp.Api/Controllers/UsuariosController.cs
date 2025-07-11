﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
namespace MasterErp.Api.Controllers;



    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    //[Authorize]

    public class UsuariosController : ControllerBase
    {

        private readonly IUsuarioService _usuarioService;

        private const string defaultCreatePassword = "1234";

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }
    
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> Get(int id)
        {
            try
            {

            var a = await _usuarioService.GetByIdAsync(id);
            
                return Ok( await _usuarioService.GetByIdAsync(id));
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
        /// Realiza a criação de usuário no Sistema
        /// </summary>
        /// <param name="Usuario"></param>
        /// <returns>O Usuário Criado </returns>
        /// 
        [HttpPost]
      

        public async Task<ActionResult> Post([FromBody] UsuarioDto model)
        {
            try
            {

                var userDb = await _usuarioService.ExistsAsync(model.Email);

                if( userDb is not null )
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { message = "Já Existe um usuário com este Email" });
                }

                Usuario u1 = new Usuario()
                {

                    Email = model.Email,
                    Nome = model.Nome,
                    Senha = BCrypt.Net.BCrypt.HashPassword(defaultCreatePassword),
                    Cargo = model.Cargo,
                    isActive = true,
                    DataCadastrado = DateTime.UtcNow.AddHours(-3)
                };


                var user = await _usuarioService.CreateAsync(u1);
                

                return Ok(user);

            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);

            }

        }

        /// <summary>
        /// Atualiza um usuário
        /// </summary>
        /// <param name="Usuario"></param>
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] Usuario model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var user = await _usuarioService.UpdateAsync(model);

                return Ok(user);


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
        /// Reseta senha do usuário
        /// </summary>
        /// <param name="Usuario"></param>
        [HttpPut("reset-password/{id}")]
        [Authorize(Roles = "Administrador,Diretor,SuporteTecnico")]
        public async Task<ActionResult> ResetUserPassword(int id)
        {

            
            try
            {
                await _usuarioService.ResetUserPassword(id);
                 
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

        /// <summary>
        /// Faz Com que o usuário se torne inativo,não podendo mais realizar login
        /// </summary>
        /// <param name="Id"></param>
        [HttpPut("turn-inactive/{id}")]
        public async Task<ActionResult> TurnInactive(int id)
        {

        try
        {
            await _usuarioService.TurnUserInactive(id);

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
        private string GenerateJwtToken(Usuario model)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("Ry74cBQva5dThwbwchR9jhbtRFnJxWSZ");

            var claims = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, model.Nome),
                new Claim(ClaimTypes.Role, model.Cargo),
                new Claim(ClaimTypes.NameIdentifier, model.Id.ToString())
            });

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<ActionResult> Authenticate(UserRequest model)
        {
            var usuarioDb = await _usuarioService.ExistsAsync(model.Email);


            if (usuarioDb is null || !BCrypt.Net.BCrypt.Verify(model.Senha, usuarioDb.Senha))

                return Unauthorized();


            if(usuarioDb.isActive is false)
            {
                //Significa que o usuário esta autenticado mas não tem permissão para acessar o recurso
                return Forbid();
            }


            var jwt = GenerateJwtToken(usuarioDb);

            return Ok(new { jwtToken = jwt,userName = usuarioDb.Nome,userId=usuarioDb.Id,role = usuarioDb.Cargo });


        }
      
    }

