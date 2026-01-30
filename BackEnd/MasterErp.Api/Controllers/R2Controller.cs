using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MasterErp.Api.Controllers
{
    // ==========================================================
    // CONTROLLER: R2Controller
    // ==========================================================
    // Responsável por gerenciar a integração com Cloudflare R2.
    // O objetivo principal é fornecer segurança ao Front-end,
    // fornecendo URLs temporárias autorizadas (Pre-signed URLs)
    // para que o upload ocorra direto do navegador para a Cloudflare.
    
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/R")]
    [ApiController]
    [Authorize]  // Apenas usuários logados podem gerar URLs de upload
    public class R2Controller : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public R2Controller(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // DTO para receber os dados do arquivo do frontend
        public class PreSignedUrlRequest
        {
            public string FileName { get; set; } = string.Empty;
            public string ContentType { get; set; } = string.Empty;
        }

        // ==========================================================
        // POST: api/r2/presigned-url
        // ==========================================================
        [HttpPost("presigned-url")]
        public IActionResult GetPresignedUrl([FromBody] PreSignedUrlRequest request)
        {
            try
            {


                // 1. Carrega configurações
                var accountId = _configuration["CloudflareR2:AccountId"];
                var accessKey = _configuration["CloudflareR2:AccessKey"];
                var secretKey = _configuration["CloudflareR2:SecretKey"];
                var bucketName = _configuration["CloudflareR2:BucketName"];

                if (string.IsNullOrEmpty(accountId) || string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey))
                {
                    return BadRequest("Configurações do R2 não encontradas");
                }

                // 2. Configurar cliente S3 (SEM SignatureVersion - SDK antigo não suporta)
                var config = new AmazonS3Config
                {
                    ServiceURL = $"https://{accountId}.r2.cloudflarestorage.com",
                    ForcePathStyle = true,
                    AuthenticationRegion = "auto"
                    // ❌ Remover: SignatureVersion = "v4"
                };

                using var client = new AmazonS3Client(accessKey, secretKey, config);

                // 3. Sanitizar nome do arquivo
                string sanitizedFileName = Path.GetFileNameWithoutExtension(request.FileName)
                    .Replace(" ", "_")
                    .Replace("(", "")
                    .Replace(")", "");
                string extension = Path.GetExtension(request.FileName);
                string uniqueFileName = $"{Guid.NewGuid()}_{sanitizedFileName}{extension}";

                // 4. Criar request de URL presignada
                var signRequest = new GetPreSignedUrlRequest
                {
                    BucketName = bucketName,
                    Key = uniqueFileName,
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(30),
                    // ✅ SOLUÇÃO: Adicionar ContentType CORRETAMENTE
                    ContentType = request.ContentType
                };

                // ❌ NÃO adicionar essas linhas que quebram:
                // signRequest.Headers["x-amz-content-sha256"] = "UNSIGNED-PAYLOAD";
                // signRequest.Headers["x-amz-content-sha256"] = request.ContentType;

                // 5. Gerar URL presignada
                string url = client.GetPreSignedURL(signRequest);

                Console.WriteLine($"[R2] URL Gerada: {url.Substring(0, 100)}...");

                // 6. Construir URL pública
                string publicUrlBase = _configuration["CloudflareR2:PublicUrl"]
                    ?? $"https://{bucketName}.{accountId}.r2.dev";

                return Ok(new
                {
                    UploadUrl = url,
                    FileKey = uniqueFileName,
                    PublicUrl = $"{publicUrlBase}/{uniqueFileName}",
                    ContentType = request.ContentType
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[R2] Erro: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message, details = ex.ToString() });
            }
        }
        // ==========================================================
        // POST: api/v1/R/upload
        // ==========================================================
        // Método "Proxy": O arquivo vai primeiro para o seu servidor.
        // Útil para quando o CORS da Cloudflare está bloqueando o frontend.
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Nenhum arquivo enviado.");

            try
            {
                var accountId = _configuration["CloudflareR2:AccountId"];
                var accessKey = _configuration["CloudflareR2:AccessKey"];
                var secretKey = _configuration["CloudflareR2:SecretKey"];
                var bucketName = _configuration["CloudflareR2:BucketName"];

                var config = new AmazonS3Config
                {
                    ServiceURL = $"https://{accountId}.r2.cloudflarestorage.com",
                    ForcePathStyle = true,
                    AuthenticationRegion = "us-east-1"
                };

                using var client = new AmazonS3Client(accessKey, secretKey, config);

                // Sanitização básica
                string sanitizedFileName = Path.GetFileNameWithoutExtension(file.FileName).Replace(" ", "_");
                string extension = Path.GetExtension(file.FileName);
                string uniqueFileName = $"{Guid.NewGuid()}_{sanitizedFileName}{extension}";

                using (var stream = file.OpenReadStream())
                {
                    var putRequest = new PutObjectRequest
                    {
                        BucketName = bucketName,
                        Key = uniqueFileName,
                        InputStream = stream,
                        ContentType = file.ContentType,
                        DisablePayloadSigning = true
                    };

                    await client.PutObjectAsync(putRequest);
                }

                string publicUrlBase = _configuration["CloudflareR2:PublicUrl"] ?? $"https://{bucketName}.{accountId}.r2.dev";

                return Ok(new
                {
                    PublicUrl = $"{publicUrlBase}/{uniqueFileName}",
                    FileKey = uniqueFileName
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro no upload via servidor: {ex.Message}");
            }
        }
    }
}
