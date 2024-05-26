using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;

namespace MasterErp.Infraestructure;

public class InventarioRepository : IInventarioRepository
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
            return await _context.Inventarios.Include(x => x.Material).OrderBy(x => x.Id).ToListAsync();

        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<Inventario> GetByIdAsync(int id)
    {

        try
        {
            return await _context.Inventarios.FindAsync(id);


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
            var inventarios = await _context.Inventarios.ToListAsync();

            model.Id = inventarios.Count + 1;

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
