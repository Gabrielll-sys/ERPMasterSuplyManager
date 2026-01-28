using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;
using MasterErp.Infraestructure.Context;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models.Pagination;
namespace MasterErp.Infraestructure
{
    
public class OrcamentoRepository : IOrcamentoRepository, IScopedService
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

            /// <summary>
            /// Realiza a paginação de orçamentos.
            /// Filtra por nome do cliente, email, documento ou nome do orçamento.
            /// </summary>
            public async Task<PagedResult<Orcamento>> GetPagedAsync(PaginationParams paginationParams)
            {
                var query = _context.Orcamentos.AsNoTracking().AsQueryable();

                if (!string.IsNullOrEmpty(paginationParams.SearchTerm))
                {
                    var searchTerm = paginationParams.SearchTerm.ToUpper();
                    query = query.Where(x => 
                        x.NomeCliente.ToUpper().Contains(searchTerm) || 
                        x.EmailCliente.ToUpper().Contains(searchTerm) || 
                        x.CpfOrCnpj.ToUpper().Contains(searchTerm) ||
                        x.NomeOrcamento.ToUpper().Contains(searchTerm));
                }

                var totalItems = await query.CountAsync();
                var items = await query
                    .OrderByDescending(x => x.DataOrcamento)
                    .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                    .Take(paginationParams.PageSize)
                    .ToListAsync();

                return new PagedResult<Orcamento>(items, totalItems, paginationParams.PageNumber, paginationParams.PageSize);
            }
    
            public async Task<Orcamento> GetByIdAsync(int? id)
            {
                try
                {
                    return await _context.Orcamentos.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
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
    
                    var orcamento  = await _context.Orcamentos.FindAsync(model.Id) ?? throw new KeyNotFoundException();
                    
                    orcamento.Observacoes = model.Observacoes;
                    orcamento.Acrescimo = model.Acrescimo;
                    orcamento.Desconto = model.Desconto;
                    orcamento.PrecoVendaTotal = model.PrecoVendaTotal;
                    orcamento.PrecoVendaComDesconto = model.PrecoVendaComDesconto;
                    orcamento.IsPayed = model.IsPayed;
                    orcamento.ResponsavelOrcamento = model.ResponsavelOrcamento;
                    orcamento.NomeCliente = model.NomeCliente;
                    orcamento.CpfOrCnpj = model.CpfOrCnpj;
                    orcamento.Empresa = model.Empresa;
                    orcamento.EmailCliente = model.EmailCliente;
                    orcamento.Endereco = model.Endereco;
                    orcamento.Telefone = model.Telefone;
                    orcamento.TipoPagamento = model.TipoPagamento;
                    
                     _context.Orcamentos.Update(orcamento);
    
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
    
                   await _context.SaveChangesAsync();
                }
    
                catch (Exception)
                {
    
                    throw;
                }
            }
    
    
        }
}

