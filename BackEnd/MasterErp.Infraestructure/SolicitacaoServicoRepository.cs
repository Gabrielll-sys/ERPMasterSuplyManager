using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;
using MasterErp.Infraestructure.Context;
using MasterErp.Domain.Interfaces.Services;

namespace MasterErp.Infraestructure;

public class SolicitacaoServicoRepository : ISolicitacaoServicoRepository, IScopedService
{
    private readonly SqlContext _context;

    public SolicitacaoServicoRepository(SqlContext context)
    {
        _context = context;
    }

    public async Task<List<SolicitacaoServico>> GetAllAsync()
    {
        try
        {
            return await _context.SolicitacoesServico
                .OrderByDescending(s => s.DataSolicitacao)
                .ToListAsync();
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<SolicitacaoServico> GetByIdAsync(int? id)
    {
        try
        {
            return await _context.SolicitacoesServico.FindAsync(id);
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<SolicitacaoServico> CreateAsync(SolicitacaoServico model)
    {
        try
        {
            model.DataSolicitacao = DateTime.UtcNow.AddHours(-3); // Horário de Brasília
            model.Status = 0; // Pendente
            
            await _context.SolicitacoesServico.AddAsync(model);
            await _context.SaveChangesAsync();

            return model;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task UpdateAsync(SolicitacaoServico model)
    {
        try
        {
            var existing = await _context.SolicitacoesServico.FindAsync(model.Id) 
                ?? throw new KeyNotFoundException();

            _context.Entry(existing).CurrentValues.SetValues(model);
            await _context.SaveChangesAsync();
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task DeleteAsync(int id)
    {
        try
        {
            var solicitacao = await _context.SolicitacoesServico.FindAsync(id) 
                ?? throw new KeyNotFoundException();

            _context.Remove(solicitacao);
            await _context.SaveChangesAsync();
        }
        catch (Exception)
        {
            throw;
        }
    }
}
