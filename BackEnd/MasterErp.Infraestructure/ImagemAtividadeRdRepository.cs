using Microsoft.EntityFrameworkCore;
using MasterErp.Infraestructure.Context;
using MasterErp.Domain.Models;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Models;
using MasterErp.Infraestructure.Context;
using MasterErp.Domain.Interfaces.Services;

namespace MasterErp.Infraestructure;

public class ImagemAtividadeRdRepository: IImagemAtividadeRdRepository, IScopedService
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
                        model.AtividadeRd = null;
        
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
                        model.AtividadeRd = null;

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