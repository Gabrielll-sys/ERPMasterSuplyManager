using Microsoft.EntityFrameworkCore;
using MasterErp.Infraestructure;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;

namespace SupplyManager.Repository;

public class ImagemAtividadeRdRepository:IImagemAtividadeRdService
{
      private readonly SqlContext _context;
        
        
                public ImagemAtividadeRdRepository(SqlContext context)
                {
                    _context = context;
                }
        
                public async Task<List<ImagemAtividadeRd>> GetAllAsync()
                {
                    try
                    {
                        return await _context.ImagensAtividadeRd.AsNoTracking().Include(x=>x.AtividadeRd).OrderBy(x=>x.Id).ToListAsync();
        
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }
        
                public async Task<ImagemAtividadeRd> GetByIdAsync(int? id)
                {
        
                    try
                    {
                        return await _context.ImagensAtividadeRd.AsNoTracking().FirstOrDefaultAsync(x=>x.Id==id);
        
        
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }
                public async Task<ImagemAtividadeRd> CreateAsync(ImagemAtividadeRd model)
                {
        
                    try
                    {
                        model.Id = null;
        
                        await _context.ImagensAtividadeRd.AddAsync(model);
        
                        await _context.SaveChangesAsync();
        
                        return model;
                      
        
                    }
                    catch(Exception) 
                    {
        
                        throw;
                    }
        
                }

                public async Task<ImagemAtividadeRd> UpdateAsync(ImagemAtividadeRd model)
                {
                    try
                    {

                        _context.ImagensAtividadeRd.Update(model);

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

                        var material = await _context.ImagensAtividadeRd.FindAsync(id) ?? throw new KeyNotFoundException();

                        _context.Remove(material);

                        _context.SaveChanges();
                    }

                    catch (Exception)
                    {

                        throw;
                    }
                }
}