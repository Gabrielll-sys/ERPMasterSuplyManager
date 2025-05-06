// Localização: MasterErp.Api/Controllers/Forms/FilledFormsController.cs
using MasterErp.Services.DTOs.Forms;
using MasterErp.Services.Interfaces.Forms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System; // Para Guid
using Microsoft.Extensions.Logging; // Para ILogger

namespace MasterErp.Api.Controllers.Forms
{
    [Route("api/filledforms")]
    [ApiController]
    [Authorize]
    public class FilledFormsController : ControllerBase
    {
        private readonly IFilledFormService _filledFormService;
        private readonly ILogger<FilledFormsController> _logger;

        public FilledFormsController(IFilledFormService filledFormService, ILogger<FilledFormsController> logger)
        {
            _filledFormService = filledFormService;
            _logger = logger;
        }

        /// <summary>
        /// Recebe um lote de formulários preenchidos do dispositivo móvel para sincronização.
        /// </summary>
        /// <param name="formsToSync">Uma lista de DTOs representando os formulários preenchidos.</param>
        /// <returns>Um resultado indicando o sucesso ou falha de cada item sincronizado.</returns>
        [HttpPost("sync")]
        [ProducesResponseType(typeof(BatchSyncResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SyncFilledForms([FromBody] List<FilledFormSyncDto> formsToSync)
        {
            if (formsToSync == null || !formsToSync.Any())
            {
                _logger.LogWarning("Tentativa de sincronização com lote de formulários vazio ou nulo.");
                return BadRequest(new { message = "Nenhum dado de formulário fornecido para sincronização." });
            }

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var filledByUserId))
            {
                _logger.LogError("Não foi possível obter o ID do usuário autenticado a partir do token para a sincronização.");
                return Unauthorized(new { message = "Falha na identificação do usuário. Token inválido ou ausente." });
            }

            _logger.LogInformation("Recebido lote de {Count} formulários para sincronizar pelo usuário ID: {UserId}", formsToSync.Count, filledByUserId);

            try
            {
                var result = await _filledFormService.ProcessSyncBatchAsync(formsToSync, filledByUserId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro crítico durante o processamento do lote de sincronização para o usuário ID: {UserId}", filledByUserId);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new BatchSyncResponseDto
                    {
                        Results = formsToSync.Select(f => new SyncResponseItemDto { ClientId = f.Id, Success = false, Message = "Erro interno do servidor ao processar este item." }).ToList()
                    });
            }
        }

        /// <summary>
        /// Obtém uma lista de instâncias de formulários preenchidos.
        /// </summary>
        /// <remarks>
        /// Adicionar parâmetros de query para paginação e filtro (ex: ?templateId=1&amp;status=SYNCED&amp;page=1&amp;pageSize=20).
        /// </remarks>
        /// <returns>Uma lista de instâncias de formulários preenchidos.</returns>
        [HttpGet]
        [Authorize(Roles = "Admin,Manager")] // Apenas Admin ou Manager podem listar todos
        [ProducesResponseType(typeof(IEnumerable<FilledFormInstanceListItemDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetFilledForms(
            [FromQuery] int? templateId,
            [FromQuery] int? filledByUserId,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] string? status, // Pode ser string e convertido para enum no serviço
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var requestingUserIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int.TryParse(requestingUserIdString, out var requestingUserId);

                _logger.LogInformation("Solicitação para listar formulários preenchidos pelo usuário ID: {RequestingUserId} com filtros: TemplateId={TemplateId}, FilledByUserId={FilledByUserId}, StartDate={StartDate}, EndDate={EndDate}, Status={Status}, Page={Page}, PageSize={PageSize}",
                    requestingUserId, templateId, filledByUserId, startDate, endDate, status, page, pageSize);

                // ** A lógica de busca e filtro real deve estar no serviço **
                // O método GetFilledFormsAsync deve ser adicionado à interface IFilledFormService e implementado.
                // Ele deve aceitar os parâmetros de filtro e paginação.
                var filledForms = await _filledFormService.GetFilledFormsAsync(
                                            templateId,
                                            filledByUserId,
                                            startDate,
                                            endDate,
                                            status,
                                            page,
                                            pageSize,
                                            requestingUserId, // Para verificar permissões no serviço
                                            User.IsInRole("Admin") || User.IsInRole("Manager") // Passar se o usuário é admin/manager
                                        );

                // Adicionar cabeçalhos de paginação na resposta se o serviço retornar essa informação
                // Ex: Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetadata));
                return Ok(filledForms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao listar formulários preenchidos.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro interno ao listar os formulários preenchidos.");
            }
        }


        /// <summary>
        /// Obtém os detalhes de uma instância específica de formulário preenchido.
        /// </summary>
        /// <param name="instanceId">O ID (Guid) da instância do formulário preenchido.</param>
        /// <returns>Os detalhes da instância do formulário ou NotFound.</returns>
        [HttpGet("{instanceId:guid}")]
        // A política de autorização aqui pode ser mais granular.
        // Por exemplo, um usuário comum só pode ver os seus próprios formulários,
        // enquanto um Admin/Manager pode ver qualquer um. Isso seria tratado no serviço.
        [ProducesResponseType(typeof(FilledFormInstanceDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)] // Se o usuário não tiver permissão
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetFilledFormDetail(Guid instanceId)
        {
            try
            {
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!int.TryParse(userIdString, out var requestingUserId))
                {
                    _logger.LogWarning("Não foi possível obter o UserID para GetFilledFormDetail. Token inválido ou claim ausente.");
                    return Unauthorized(new { message = "Falha na identificação do usuário." });
                }

                _logger.LogInformation("Solicitação para obter detalhes do formulário preenchido ID: {InstanceId} pelo usuário ID: {UserId}", instanceId, requestingUserId);

                // ** A lógica de busca e verificação de permissão real deve estar no serviço **
                // O método GetFilledFormDetailAsync deve ser adicionado à interface IFilledFormService e implementado.
                // Ele deve verificar se o requestingUserId tem permissão para ver este instanceId.
                var formDetail = await _filledFormService.GetFilledFormDetailAsync(instanceId, requestingUserId, User.IsInRole("Admin") || User.IsInRole("Manager"));

                if (formDetail == null)
                {
                    _logger.LogWarning("Formulário preenchido ID: {InstanceId} não encontrado ou acesso não permitido para o usuário ID: {UserId}", instanceId, requestingUserId);
                    return NotFound(new { message = $"Formulário preenchido com ID {instanceId} não encontrado ou acesso não permitido." });
                }
                return Ok(formDetail);
            }
            catch (UnauthorizedAccessException unauthEx)
            {
                _logger.LogWarning(unauthEx, "Acesso não autorizado ao formulário preenchido ID: {InstanceId}.", instanceId);
                return Forbid(); // Ou StatusCode(StatusCodes.Status403Forbidden, new { message = unauthEx.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao obter detalhes do formulário preenchido ID: {InstanceId}", instanceId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um erro interno ao obter os detalhes do formulário preenchido.");
            }
        }
    }
}
