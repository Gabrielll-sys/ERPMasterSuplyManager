using SupplyManager.Models;
using SupplyManager.Repository;

namespace SupplyManager.Services;

public class AtividadeRdService : IAtividadeRdService
{
            private readonly IAtividadeRdRepository _atividadeRdRepository;
    
            public AtividadeRdService(IAtividadeRdRepository atividadeRepository)
            {
                _atividadeRdRepository = atividadeRepository;
            }
    
            public async Task<AtividadeRd> CreateAsync(AtividadeRd model)
            {
                try
                {
    
    
                    var all = await _atividadeRdRepository.GetAllAsync();
    
                    await _atividadeRdRepository.CreateAsync(model);
    
                    model.Id = all.Count + 1;
    
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
                    await _atividadeRdRepository.DeleteAsync(id);
                }
                catch (Exception)
                {
                    throw;
                }
            }
    
            public async Task<List<AtividadeRd>> GetAllAsync()
            {
                try
                {
                    return await _atividadeRdRepository.GetAllAsync();
                }
                catch (Exception)
                {
                    throw;
                }
            }
            public async Task<List<AtividadeRd>> GetAllInRdAsync(int id)
            {
                try
                {
                    List<AtividadeRd> atividadeRdsOnRd = new List<AtividadeRd>();
                    
                    
                    var all=  await _atividadeRdRepository.GetAllAsync();

                    foreach (var item in all)
                    {
                        if(item.RelatorioRdId == id) atividadeRdsOnRd.Add(item);
                        
                    }

                    return atividadeRdsOnRd;

                }
                catch (Exception)
                {
                    throw;
                }
            }
            public async Task<AtividadeRd> GetByIdAsync(int id)
            {
                try
                {
                     return  await _atividadeRdRepository.GetByIdAsync(id);
                }
                catch (Exception)
                {
                    throw;
                }
            }
    
            public async Task<AtividadeRd> UpdateAsync(AtividadeRd model)
            {
                try
                {
                   var a =  await _atividadeRdRepository.UpdateAsync(model);
                   return a;
                }
                catch (Exception)
                {
                    throw;
                }
            }
       
        }
