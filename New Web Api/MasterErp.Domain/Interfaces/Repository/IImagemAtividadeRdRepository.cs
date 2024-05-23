using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Repository;

public interface IImagemAtividadeRdRepository
{
    Task<ImagemAtividadeRd > GetByIdAsync(int? id);


    Task<List<ImagemAtividadeRd>> GetAllAsync();

    Task<ImagemAtividadeRd > CreateAsync(ImagemAtividadeRd model);

    Task<ImagemAtividadeRd> UpdateAsync(ImagemAtividadeRd  model);


    Task DeleteAsync(int id);
}