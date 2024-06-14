
using MasterErp.Domain.Models;

namespace MasterErp.Domain.Interfaces.Services;
public interface IImagemAtividadeRdService
{
    Task<ImagemAtividadeRd > GetByIdAsync(int? id);


    Task<List<ImagemAtividadeRd>> GetAllAsync();

    Task<ImagemAtividadeRd > CreateAsync(ImagemAtividadeRd model);

    Task<ImagemAtividadeRd> UpdateAsync(ImagemAtividadeRd  model);

    Task<List<ImagemAtividadeRd>> GetAllImagensInAtividade(int? id);
    Task DeleteAsync(int id);
}