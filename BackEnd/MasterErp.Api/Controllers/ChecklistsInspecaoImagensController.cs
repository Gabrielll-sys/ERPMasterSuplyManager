using System.Net;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;

namespace MasterErp.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class ChecklistsInspecaoImagensController : ControllerBase
{
    private readonly IChecklistInspecaoImagemService _service;
    private readonly IConfiguration _configuration;

    public ChecklistsInspecaoImagensController(IChecklistInspecaoImagemService service, IConfiguration configuration)
    {
        _service = service;
        _configuration = configuration;
    }

    // Lista imagens de um checklist especifico.
    [HttpGet("checklist/{checklistId}")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    public async Task<IActionResult> GetByChecklistId(int checklistId)
    {
        var imagens = await _service.GetByChecklistIdAsync(checklistId);
        return Ok(imagens);
    }

    // Cria imagem vinculada ao checklist (URL + key).
    [HttpPost("{checklistId}")]
    [Authorize(Roles = "Administrador,Diretor,SuporteTecnico,SuporteTÃƒÂ©cnico")]
    [ProducesResponseType((int)HttpStatusCode.Created)]
    public async Task<IActionResult> Create(int checklistId, [FromBody] ChecklistInspecaoImagem model)
    {
        if (string.IsNullOrWhiteSpace(model.ImageUrl) || string.IsNullOrWhiteSpace(model.ImageKey))
        {
            return BadRequest("ImageUrl e ImageKey sao obrigatorios");
        }

        var created = await _service.CreateAsync(checklistId, model);
        return CreatedAtAction(nameof(GetByChecklistId), new { checklistId }, created);
    }

    // Remove imagem (R2 + banco).
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador,Diretor,SuporteTecnico,SuporteTÃƒÂ©cnico")]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var imagem = await _service.GetByIdAsync(id);
            if (imagem == null) return NotFound("Imagem nao encontrada");

            // Remove do R2 antes de excluir o registro local.
            if (!string.IsNullOrWhiteSpace(imagem.ImageKey))
            {
                await DeleteFromR2Async(imagem.ImageKey);
            }

            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    private async Task DeleteFromR2Async(string imageKey)
    {
        var accountId = _configuration["CloudflareR2:AccountId"];
        var accessKey = _configuration["CloudflareR2:AccessKey"];
        var secretKey = _configuration["CloudflareR2:SecretKey"];
        var bucketName = _configuration["CloudflareR2:BucketName"];

        if (string.IsNullOrWhiteSpace(accountId) || string.IsNullOrWhiteSpace(accessKey)
            || string.IsNullOrWhiteSpace(secretKey) || string.IsNullOrWhiteSpace(bucketName))
        {
            throw new InvalidOperationException("Configuracoes do R2 nao encontradas");
        }

        var config = new AmazonS3Config
        {
            ServiceURL = $"https://{accountId}.r2.cloudflarestorage.com",
            ForcePathStyle = true,
            AuthenticationRegion = "auto"
        };

        using var client = new AmazonS3Client(accessKey, secretKey, config);
        var deleteRequest = new DeleteObjectRequest
        {
            BucketName = bucketName,
            Key = imageKey
        };

        await client.DeleteObjectAsync(deleteRequest);
    }
}
