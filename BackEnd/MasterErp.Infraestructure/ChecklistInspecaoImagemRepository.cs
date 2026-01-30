using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using MasterErp.Infraestructure.Context;
using Microsoft.EntityFrameworkCore;

namespace MasterErp.Infraestructure;

// Repositorio de imagens do checklist de inspecao.
public class ChecklistInspecaoImagemRepository : IChecklistInspecaoImagemRepository, IScopedService
{
    private readonly SqlContext _context;

    public ChecklistInspecaoImagemRepository(SqlContext context)
    {
        _context = context;
    }

    public async Task<List<ChecklistInspecaoImagem>> GetByChecklistIdAsync(int checklistId)
    {
        // Lista ordenada por mais recente.
        return await _context.ChecklistsInspecaoImagens
            .AsNoTracking()
            .Where(x => x.ChecklistInspecaoId == checklistId)
            .OrderByDescending(x => x.Id)
            .ToListAsync();
    }

    public async Task<ChecklistInspecaoImagem?> GetByIdAsync(int id)
    {
        return await _context.ChecklistsInspecaoImagens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<ChecklistInspecaoImagem> CreateAsync(ChecklistInspecaoImagem model)
    {
        // Garante que a navegacao nao seja persistida pelo EF.
        model.ChecklistInspecao = null;

        await _context.ChecklistsInspecaoImagens.AddAsync(model);
        await _context.SaveChangesAsync();

        return model;
    }

    public async Task DeleteAsync(ChecklistInspecaoImagem model)
    {
        _context.ChecklistsInspecaoImagens.Remove(model);
        await _context.SaveChangesAsync();
    }
}
