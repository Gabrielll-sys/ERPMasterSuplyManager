using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;

// Contrato para geraÃ§Ã£o de PDF da APR.
public interface IAprPdfService
{
    // Gera o PDF da APR no formato byte[] para download.
    Task<byte[]> GenerateAsync(Apr apr);
}
