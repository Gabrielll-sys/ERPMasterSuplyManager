using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using MasterErp.Infraestructure.Context;
using Microsoft.EntityFrameworkCore;

namespace MasterErp.Infraestructure;

public class AprRepository : IAprRepository, IScopedService
{
    private readonly SqlContext _context;

    public AprRepository(SqlContext context)
    {
        _context = context;
    }

    public async Task<List<Apr>> GetAllAsync()
    {
        return await _context.Aprs
            .AsNoTracking()
            .OrderByDescending(x => x.Data)
            .ToListAsync();
    }

    public async Task<Apr?> GetByIdAsync(int id)
    {
        return await _context.Aprs.FindAsync(id);
    }

    public async Task<Apr> CreateAsync(Apr model)
    {
        // Cria nova APR com todos os campos, incluindo Tipo
        var apr = new Apr
        {
            Titulo = model.Titulo,
            Data = model.Data == default ? DateTime.UtcNow.AddHours(-3) : model.Data,
            // Tipo: "completa" (padrão) ou "rapida" para formulário simplificado
            Tipo = string.IsNullOrWhiteSpace(model.Tipo) ? "completa" : model.Tipo,
            ConteudoJson = string.IsNullOrWhiteSpace(model.ConteudoJson) ? "{}" : model.ConteudoJson,
            CriadoEm = DateTime.UtcNow.AddHours(-3),
        };

        await _context.Aprs.AddAsync(apr);
        await _context.SaveChangesAsync();

        return apr;
    }

    public async Task<Apr> UpdateAsync(Apr model)
    {
        var apr = await _context.Aprs.FindAsync(model.Id) ?? throw new KeyNotFoundException();

        apr.Titulo = model.Titulo;
        apr.Data = model.Data == default ? apr.Data : model.Data;
        // Mantém o Tipo existente se não for informado, ou atualiza se fornecido
        if (!string.IsNullOrWhiteSpace(model.Tipo))
        {
            apr.Tipo = model.Tipo;
        }
        apr.ConteudoJson = string.IsNullOrWhiteSpace(model.ConteudoJson) ? apr.ConteudoJson : model.ConteudoJson;
        apr.AtualizadoEm = DateTime.UtcNow.AddHours(-3);

        // Atualiza campos de fechamento se fornecidos
        // Uma vez fechada, a APR mantém o status (não pode ser reaberta via update normal)
        if (model.Fechada && !apr.Fechada)
        {
            apr.Fechada = true;
            apr.FechadaPor = model.FechadaPor;
            apr.FechadaEm = DateTime.UtcNow.AddHours(-3);
        }

        _context.Aprs.Update(apr);
        await _context.SaveChangesAsync();

        return apr;
    }

    public async Task DeleteAsync(int id)
    {
        var apr = await _context.Aprs.FindAsync(id) ?? throw new KeyNotFoundException();
        _context.Aprs.Remove(apr);
        await _context.SaveChangesAsync();
    }
}
