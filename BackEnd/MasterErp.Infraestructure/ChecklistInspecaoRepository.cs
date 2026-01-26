using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using MasterErp.Infraestructure.Context;
using Microsoft.EntityFrameworkCore;

namespace MasterErp.Infraestructure;

// Repositorio de acesso ao checklist de inspecao.
public class ChecklistInspecaoRepository : IChecklistInspecaoRepository, IScopedService
{
    private readonly SqlContext _context;

    public ChecklistInspecaoRepository(SqlContext context)
    {
        _context = context;
    }

    public async Task<List<ChecklistInspecao>> GetAllAsync()
    {
        // Historico ordenado pela data de criacao.
        return await _context.ChecklistsInspecao
            .AsNoTracking()
            .OrderByDescending(x => x.CriadoEm)
            .ToListAsync();
    }

    public async Task<ChecklistInspecao?> GetByIdAsync(int id)
    {
        return await _context.ChecklistsInspecao.FindAsync(id);
    }

    public async Task<ChecklistInspecao> CreateAsync(ChecklistInspecao model)
    {
        var checklist = new ChecklistInspecao
        {
            ConteudoJson = string.IsNullOrWhiteSpace(model.ConteudoJson) ? "{}" : model.ConteudoJson,
            CriadoEm = DateTime.UtcNow.AddHours(-3),
        };

        await _context.ChecklistsInspecao.AddAsync(checklist);
        await _context.SaveChangesAsync();

        return checklist;
    }

    public async Task<ChecklistInspecao> UpdateAsync(ChecklistInspecao model)
    {
        var checklist = await _context.ChecklistsInspecao.FindAsync(model.Id) ?? throw new KeyNotFoundException();

        checklist.ConteudoJson = string.IsNullOrWhiteSpace(model.ConteudoJson) ? checklist.ConteudoJson : model.ConteudoJson;
        checklist.AtualizadoEm = DateTime.UtcNow.AddHours(-3);

        _context.ChecklistsInspecao.Update(checklist);
        await _context.SaveChangesAsync();

        return checklist;
    }

    public async Task DeleteAsync(int id)
    {
        var checklist = await _context.ChecklistsInspecao.FindAsync(id) ?? throw new KeyNotFoundException();
        _context.ChecklistsInspecao.Remove(checklist);
        await _context.SaveChangesAsync();
    }
}
