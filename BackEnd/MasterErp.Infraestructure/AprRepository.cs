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
        var apr = new Apr
        {
            Titulo = model.Titulo,
            Data = model.Data == default ? DateTime.UtcNow.AddHours(-3) : model.Data,
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
        apr.ConteudoJson = string.IsNullOrWhiteSpace(model.ConteudoJson) ? apr.ConteudoJson : model.ConteudoJson;
        apr.AtualizadoEm = DateTime.UtcNow.AddHours(-3);

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
