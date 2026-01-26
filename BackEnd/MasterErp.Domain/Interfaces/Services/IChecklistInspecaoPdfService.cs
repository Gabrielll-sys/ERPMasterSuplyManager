using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;

// Contrato para geracao de PDF do checklist de inspecao.
public interface IChecklistInspecaoPdfService
{
    // Gera o PDF no formato byte[] para download.
    Task<byte[]> GenerateAsync(ChecklistInspecao checklist);
}
