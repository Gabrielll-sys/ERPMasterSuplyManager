using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;
using MasterErp.Infraestructure.Context;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models.Pagination;

namespace MasterErp.Infraestructure;

public class InventarioRepository : IInventarioRepository, IScopedService
{
    private readonly SqlContext _context;


    public InventarioRepository(SqlContext context)
    {
        _context = context;
    }

    public async Task<List<Inventario>> GetAllAsync()
    {
        try
        {
            return await _context.Inventarios.AsNoTracking().Include(x => x.Material).OrderBy(x => x.Id).ToListAsync();

        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<List<Inventario>> GetByMaterialIdAsync(int materialId)
    {
        return await _context.Inventarios
            .Where(x => x.MaterialId == materialId)
            .OrderBy(x => x.Id)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Realiza a paginação de registros de inventário com busca.
    /// Inclui o Material relacionado e utiliza AsNoTracking para performance.
    /// </summary>
    public async Task<PagedResult<Inventario>> GetPagedAsync(PaginationParams paginationParams)
    {
        var query = _context.Inventarios.AsNoTracking().Include(x => x.Material).AsQueryable();

        if (!string.IsNullOrEmpty(paginationParams.SearchTerm))
        {
            var searchTerm = paginationParams.SearchTerm.ToUpper();
            query = query.Where(x => 
                x.Material.Descricao.ToUpper().Contains(searchTerm) || 
                x.Material.CodigoInterno.ToUpper().Contains(searchTerm) ||
                x.Material.CodigoFabricante.ToUpper().Contains(searchTerm) ||
                x.Material.Marca.ToUpper().Contains(searchTerm) ||
                x.Responsavel.ToUpper().Contains(searchTerm));
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderBy(x => x.Id)
            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize)
            .ToListAsync();

        return new PagedResult<Inventario>(items, totalItems, paginationParams.PageNumber, paginationParams.PageSize);
    }

    public async Task<Inventario> GetByIdAsync(int id)
    {

        try
        {
            return await _context.Inventarios.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);


        }
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<Inventario> BuscaDescricao(string descricao)
    {

        try
        {
            return null;


        }
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<Inventario> CreateAsync(Inventario model)
    {

        try
        {
            model.Id = 0; // Deixa o banco gerenciar o Auto-Incremento

            await _context.Inventarios.AddAsync(model);

            await _context.SaveChangesAsync();

            return model;


        }
        catch (Exception)
        {

            throw;
        }

    }
    public async Task<Inventario> UpdateAsync(Inventario model)
    {
        try
        {

            _ = await _context.Inventarios.FindAsync(model.Id) ?? throw new KeyNotFoundException();

            _context.Inventarios.Update(model);

            await _context.SaveChangesAsync();

            return model;

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

            var invetario = await _context.Inventarios.FindAsync(id) ?? throw new KeyNotFoundException();

            _context.Remove(invetario);

            await _context.SaveChangesAsync();
        }
        catch (Exception)
        {

            throw;
        }
    }


}
