using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;

public interface IOrcamentoPdfService
{
    Task<byte[]> GenerateAsync(Orcamento orcamento, List<ItemOrcamento> itens, string? nomeUsuario);
}
