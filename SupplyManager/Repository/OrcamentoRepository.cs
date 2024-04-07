using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Models;

namespace SupplyManager.Repository;

public class OrcamentoRepository
{
    private readonly SqlContext _context;
    
    
            public OrcamentoRepository(SqlContext context)
            {
                _context = context;
            }
    
            public async Task<List<Orcamento>> GetAllAsync()
            {
                try
                {
                  return await _context.Orcamentos.AsNoTracking().OrderByDescending(x=>x.DataOrcamento).ToListAsync();
    
                }
                catch (Exception)
                {
                    throw;
                }
            }
    
            public async Task<Orcamento> GetByIdAsync(int? id)
            {
    
                try
                {
                    return await _context.Orcamentos.FindAsync(id);
    
    
                }
                catch (Exception)
                {
                    throw;
                }
            }
            public async Task<Orcamento> CreateAsync(Orcamento model)
            {
    
                try
                {
                    Orcamento orcamento = new Orcamento()
                    {
                        ResponsavelOrcamento = model.ResponsavelOrcamento,
                        ResponsavelVenda = model.ResponsavelVenda,
                        DataOrcamento = DateTime.UtcNow.AddHours(-3),
                        NomeOrcamento = model.NomeOrcamento,
                        Observacoes = model.Observacoes,
                        Desconto = model.Desconto,
                        Acrescimo = model.Acrescimo,
                        PrecoVendaTotal = model.PrecoVendaTotal,
                        PrecoVendaComDesconto = model.PrecoVendaComDesconto,
                        NomeCliente = model.NomeCliente,
                        Empresa = model.Empresa,
                        EmailCliente = model.EmailCliente,
                        Telefone = model.Telefone,
                        Endereco = model.Endereco,
                        CpfOrCnpj = model.CpfOrCnpj,
                        TipoPagamento = model.TipoPagamento,
                        IsPayed = false,
                    };
                    
                    await _context.Orcamentos.AddAsync(orcamento);
    
                    await _context.SaveChangesAsync();
    
                    return model;
    
    
                }
                catch (Exception)
                {
    
                    throw;
                }
    
            }
            public async Task UpdateAsync(Orcamento model)
            {
                try
                {
    
                    _ = await _context.Orcamentos.FindAsync(model.Id) ?? throw new KeyNotFoundException();
    
                    _context.Orcamentos.Update(model);
    
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
    
                    var ordemServico = await _context.Orcamentos.FindAsync(id) ?? throw new KeyNotFoundException();
    
                    _context.Remove(ordemServico);
    
                    _context.SaveChanges();
                }
    
                catch (Exception)
                {
    
                    throw;
                }
            }
    
    
        }
