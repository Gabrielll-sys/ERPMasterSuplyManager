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

namespace SupplyManager.Controllers
{

    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    /*[Authorize]
*/
    public class UsuariosController:ControllerBase
    {

        private readonly IUsuarioService _usuarioService;

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }


        /// <summary>
        /// Realiza a criação de usuário no Sistema
        /// </summary>
        /// <param name="Usuario"></param>
        /// <returns>O Usuário Criado </returns>
        /// 
        [HttpPost]
        [Authorize(Roles = "Diretor")]
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
                    Senha = BCrypt.Net.BCrypt.HashPassword(model.Senha),
                    Cargo = model.Cargo,
                    DataCadastro = DateTime.UtcNow.AddHours(-3)
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

       /* [HttpPut("promote-demote-user/{id}")]
        public async Task<ActionResult> PutDemotePromote(int id, [FromBody] Usuario model)
        {

            if (model.Id != id) return StatusCode(StatusCodes.Status400BadRequest);

            try
            {
                var user = await _context.Usuarios.FindAsync(id) ?? throw new KeyNotFoundException();

                user.Email = model.Email;
                user.Nome = model.Nome;
                user.Senha = BCrypt.Net.BCrypt.HashPassword(model.Senha);

                user.PerfilUsuario = user.PerfilUsuario;
                _context.Usuarios.Update(user);

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
        }*/

        private string GenerateJwtToken(Usuario model)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("Ry74cBQva5dThwbwchR9jhbtRFnJxWSZ");

            var claims = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, model.Id.ToString()),
                new Claim(ClaimTypes.Role, model.Cargo)
            });

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddHours(10),
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
/*
            if ((usuarioDb.PerfilUsuario.ToString() != "Diretor") &&
                (model.PerfilAutorizado != null && !model.PerfilAutorizado.Any(p => p.ToString() == usuarioDb.PerfilUsuario.ToString())))
            {
                return Forbid();
            }*/

            var jwt = GenerateJwtToken(usuarioDb);

            return Ok(new { jwtToken = jwt, userName = usuarioDb.Nome });


        }
      
    }
}
