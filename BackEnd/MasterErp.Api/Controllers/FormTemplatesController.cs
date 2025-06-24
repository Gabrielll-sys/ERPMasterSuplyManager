// Localização: MasterErp.Api/Controllers/Forms/FormTemplatesController.cs
using MasterErp.Services.Interfaces.Forms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MasterErp.Services.DTOs.Forms; // DTOs para Create, Update, Detail, Basic
using System.Security.Claims; // Para ClaimTypes
using Microsoft.Extensions.Logging; // Para ILogger
using System; // Para Exception
using System.Collections.Generic; // Para IEnumerable

namespace MasterErp.Api.Controllers.Forms
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    //[Authorize]
    public class FormTemplatesController : ControllerBase
    {
        private readonly IFormTemplateService _formTemplateService;
        private readonly ILogger<FormTemplatesController> _logger;

        public FormTemplatesController(IFormTemplateService formTemplateService, ILogger<FormTemplatesController> logger)
        {
            _formTemplateService = formTemplateService;
            _logger = logger;
        }

        /// <summary>
        /// Obtém uma lista de todos os modelos de formulário ativos (versão mais recente de cada).
        /// </summary>
        /// <returns>Uma lista de modelos de formulário básicos.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<FormTemplateBasicDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetActiveTemplates()
        {
            try
            {
                _logger.LogInformation("Solicitação para obter lista de modelos de formulário ativos.");
                var templates = await _formTemplateService.GetActiveTemplatesAsync();
                return Ok(templates);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao obter modelos de formulário ativos.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro interno ao processar a sua solicitação.");
            }
        }

        /// <summary>
        /// Obtém os detalhes de uma versão específica de um modelo de formulário.
        /// Se a versão não for especificada, obtém a mais recente.
        /// </summary>
        /// <param name="templateId">O ID do modelo de formulário.</param>
        /// <param name="versionNumber">O número da versão do modelo (opcional).</param>
        /// <returns>Os detalhes do modelo de formulário ou NotFound se não encontrado.</returns>
        [HttpGet("{templateId:int}/version/{versionNumber:int?}")]
        [ProducesResponseType(typeof(FormTemplateDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetTemplateDetail(int templateId, int? versionNumber = null)
        {
            try
            {
                _logger.LogInformation("Solicitação para obter detalhes do modelo ID: {TemplateId}, Versão: {VersionNumber}", templateId, versionNumber?.ToString() ?? "latest");
                var templateDetail = await _formTemplateService.GetTemplateDetailAsync(templateId, versionNumber);

                if (templateDetail == null)
                {
                    _logger.LogWarning("Modelo ID: {TemplateId}, Versão: {VersionNumber} não encontrado.", templateId, versionNumber?.ToString() ?? "latest");
                    return NotFound(new { message = $"Modelo com ID {templateId} (Versão: {versionNumber?.ToString() ?? "mais recente"}) não encontrado." });
                }
                return Ok(templateDetail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao obter detalhes do modelo ID: {TemplateId}", templateId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro interno ao processar a sua solicitação.");
            }
        }

        /// <summary>
        /// Cria um novo modelo de formulário. (Uso Administrativo)
        /// </summary>
        /// <param name="createDto">Os dados para criar o novo modelo de formulário.</param>
        /// <returns>Os detalhes do modelo de formulário criado.</returns>
        [HttpPost]
        //[Authorize(Roles = "Admin")] // Apenas usuários com o papel "Admin" podem criar
        [ProducesResponseType(typeof(FormTemplateDetailDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateFormTemplate([FromBody] FormTemplateCreateDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                //var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                //if (!int.TryParse(userIdString, out var createdByUserId))
                //{
                //    _logger.LogWarning("Não foi possível obter o UserID para CreateFormTemplate. Token inválido ou claim ausente.");
                //    return Unauthorized(new { message = "Falha na identificação do usuário." });
                //}

                //_logger.LogInformation("Tentativa de criar novo modelo de formulário '{TemplateName}' pelo usuário ID: {UserId}", createDto.Name, createdByUserId);

                // ** A lógica de criação real deve estar no serviço **
                // O método CreateTemplateAsync deve ser adicionado à interface IFormTemplateService e implementado.
                // Ele deve retornar o DTO do template criado ou lançar exceções específicas.
                var newTemplateDetail = await _formTemplateService.CreateTemplateAsync(createDto, 3);

                if (newTemplateDetail == null) // O serviço pode retornar null se algo der errado e não for uma exceção
                {
                    _logger.LogError("Serviço CreateTemplateAsync retornou null para o template '{TemplateName}' pelo usuário ID: {UserId}", createDto.Name, 3);
                    return StatusCode(StatusCodes.Status500InternalServerError, "Não foi possível criar o modelo de formulário.");
                }

                _logger.LogInformation("Modelo de formulário '{TemplateName}' (ID: {TemplateId}, Versão: {Version}) criado com sucesso.", newTemplateDetail.Name, newTemplateDetail.Id, newTemplateDetail.Version);
                return CreatedAtAction(nameof(GetTemplateDetail), new { templateId = newTemplateDetail.Id, versionNumber = newTemplateDetail.Version }, newTemplateDetail);
            }
            catch (ArgumentException argEx) // Exemplo de tratamento de erro específico do serviço
            {
                _logger.LogWarning(argEx, "Argumento inválido ao criar modelo de formulário '{TemplateName}'.", createDto.Name);
                return BadRequest(new { message = argEx.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar novo modelo de formulário '{TemplateName}'.", createDto.Name);
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro interno ao criar o modelo de formulário.");
            }
        }

        /// <summary>
        /// Atualiza um modelo de formulário existente. (Uso Administrativo)
        /// </summary>
        /// <param name="templateId">O ID do modelo de formulário a ser atualizado.</param>
        /// <param name="updateDto">Os dados para atualizar o modelo de formulário.</param>
        /// <returns>Nenhum conteúdo em caso de sucesso ou NotFound.</returns>
        [HttpPut("{templateId:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateFormTemplate(int templateId, [FromBody] FormTemplateUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!int.TryParse(userIdString, out var updatedByUserId))
                {
                    _logger.LogWarning("Não foi possível obter o UserID para UpdateFormTemplate. Token inválido ou claim ausente.");
                    return Unauthorized(new { message = "Falha na identificação do usuário." });
                }

                _logger.LogInformation("Tentativa de atualizar modelo de formulário ID: {TemplateId} pelo usuário ID: {UserId}", templateId, updatedByUserId);

                // ** A lógica de atualização real deve estar no serviço **
                // O método UpdateTemplateAsync deve ser adicionado à interface IFormTemplateService e implementado.
                // Ele pode retornar um booleano (sucesso/falha) ou o DTO atualizado.
                // A estratégia de versionamento (criar nova versão ou atualizar no local) é definida no serviço.
                var updatedTemplate = await _formTemplateService.UpdateTemplateAsync(templateId, updateDto, updatedByUserId);

                if (updatedTemplate == null) // Ou se o serviço retornar um booleano: if(!success)
                {
                    _logger.LogWarning("Modelo de formulário ID: {TemplateId} não encontrado para atualização ou falha na atualização.", templateId);
                    return NotFound(new { message = $"Modelo com ID {templateId} não encontrado ou não pôde ser atualizado." });
                }

                _logger.LogInformation("Modelo de formulário ID: {TemplateId} atualizado com sucesso para a versão {Version}.", updatedTemplate.Id, updatedTemplate.Version);
                return NoContent(); // Ou Ok(updatedTemplate) se preferir retornar o objeto atualizado
            }
            catch (KeyNotFoundException) // Exemplo se o serviço lança KeyNotFoundException
            {
                _logger.LogWarning("Modelo de formulário ID: {TemplateId} não encontrado durante a tentativa de atualização.", templateId);
                return NotFound(new { message = $"Modelo com ID {templateId} não encontrado." });
            }
            catch (ArgumentException argEx)
            {
                _logger.LogWarning(argEx, "Argumento inválido ao atualizar modelo de formulário ID: {TemplateId}.", templateId);
                return BadRequest(new { message = argEx.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar modelo de formulário ID: {TemplateId}", templateId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro interno ao atualizar o modelo de formulário.");
            }
        }

        /// <summary>
        /// Deleta (ou desativa) um modelo de formulário. (Uso Administrativo)
        /// </summary>
        /// <param name="templateId">O ID do modelo de formulário a ser deletado/desativado.</param>
        /// <returns>Nenhum conteúdo em caso de sucesso ou NotFound.</returns>
        [HttpDelete("{templateId:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteFormTemplate(int templateId)
        {
            try
            {
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int.TryParse(userIdString, out var deletedByUserId); // Para logging

                _logger.LogInformation("Tentativa de deletar/desativar modelo de formulário ID: {TemplateId} pelo usuário ID: {UserId}", templateId, deletedByUserId);

                // ** A lógica de deleção/desativação real deve estar no serviço **
                // O método DeleteTemplateAsync deve ser adicionado à interface IFormTemplateService e implementado.
                // Ele deve retornar um booleano (sucesso/falha).
                // Considerar "soft delete" (marcar como IsActive = false) em vez de deleção física.
                var success = await _formTemplateService.DeleteTemplateAsync(templateId);

                if (!success)
                {
                    _logger.LogWarning("Modelo de formulário ID: {TemplateId} não encontrado para deleção/desativação ou falha na operação.", templateId);
                    return NotFound(new { message = $"Modelo com ID {templateId} não encontrado ou não pôde ser deletado/desativado." });
                }

                _logger.LogInformation("Modelo de formulário ID: {TemplateId} deletado/desativado com sucesso.", templateId);
                return NoContent();
            }
            catch (InvalidOperationException opEx) // Exemplo: Se o serviço impedir deleção de template em uso
            {
                _logger.LogWarning(opEx, "Operação inválida ao tentar deletar modelo de formulário ID: {TemplateId}.", templateId);
                return BadRequest(new { message = opEx.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao deletar/desativar modelo de formulário ID: {TemplateId}", templateId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro interno ao deletar/desativar o modelo de formulário.");
            }
        }
    }
}