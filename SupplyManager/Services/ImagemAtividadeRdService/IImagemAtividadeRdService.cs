using SupplyManager.Models;

namespace SupplyManager.Repository;

public interface IImagemAtividadeRdService
{
    Task<ImagemAtividadeRd > GetByIdAsync(int? id);


    Task<List<ImagemAtividadeRd>> GetAllAsync();

    Task<ImagemAtividadeRd > CreateAsync(ImagemAtividadeRd model);

    Task<ImagemAtividadeRd> UpdateAsync(ImagemAtividadeRd  model);


    Task DeleteAsync(int id);
}