using System.Security.Claims;

using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using Microsoft.AspNetCore.Http;

namespace MasterErp.Services;

public class AtividadeRdService : IAtividadeRdService, IScopedService
{
    private readonly IAtividadeRdRepository _atividadeRdRepository;

    private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;

       private readonly IHttpContextAccessor _httpContextAccessor;


    public AtividadeRdService(IAtividadeRdRepository atividadeRepository,
        ILogAcoesUsuarioService logAcoesUsuarioService, IHttpContextAccessor httpContextAccessor)
    {
        _atividadeRdRepository = atividadeRepository;

        _logAcoesUsuarioService = logAcoesUsuarioService;

        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<AtividadeRd> CreateAsync(AtividadeRd model)
    {
        try
        {

            var all = await _atividadeRdRepository.GetAllAsync();

            var numeroAtividadesInRelatorio = all.Where(x => x.RelatorioRdId == model.RelatorioRdId).ToList();

            model.NumeroAtividade = numeroAtividadesInRelatorio.Count + 1;

            model.Status = "Não Iniciada";

            model.DataAtividade = DateTime.UtcNow.AddHours(-3);

            await _atividadeRdRepository.CreateAsync(model);

            var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

            string logAction = $"Adição da Atividade {model.Descricao} ao Relatório Diário Nº {model.RelatorioRdId} ";

            LogAcoesUsuario log = new LogAcoesUsuario(acao: logAction,
                responsavel: userName);

            await _logAcoesUsuarioService.CreateAsync(log);

            model.Id = all.Count + 1;

            return model;

        }
        catch (Exception)
        {
            throw;
        }
    }

    
    public async Task ReordarNumeroAtividadeAfterDelete(int? id)
    {
        
        var atividades = await GetAllInRdAsync(id);
        //Renumera as atividades para ficarem em ordem

        for (int i = 0; i <= atividades.Count-1; i++)
        {
            atividades[i].NumeroAtividade = i+1;
 
        }

        await UpdateAllAsync(atividades);
        
    }
    
    public async Task DeleteAsync(int id)
    {
        try
        {
            //Quando o metodo de reodernar vem antes do delete, ele consegue obter o item,verificar porque

            var atividadeRd = await _atividadeRdRepository.GetByIdAsync(id);

            await _atividadeRdRepository.DeleteAsync(id);

            await ReordarNumeroAtividadeAfterDelete(atividadeRd.RelatorioRdId);
         
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
            public async Task<List<AtividadeRd>> GetAllInRdAsync(int? id)
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
       
             private async Task UpdateAllAsync(List<AtividadeRd> atividades) 
                {
                    
                    foreach (var atividade in atividades) 
                    {

                         await UpdateAsync(atividade);

                     }

    }
}
