using System.Security.Claims;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using Microsoft.AspNetCore.Http;

namespace MasterErp.Services;

public class ImagemAtividadeRdService:IImagemAtividadeRdService
{
      private readonly IImagemAtividadeRdRepository _imagemAtividadeRdRepository;

      private readonly IAtividadeRdRepository _atividadeRdRepository;

    private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;

        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public ImagemAtividadeRdService(IImagemAtividadeRdRepository imagemSeparacaoRepository, IAtividadeRdRepository atividadeRdRepository, ILogAcoesUsuarioService logAcoesUsuarioService, IHttpContextAccessor httpContextAccessor)
        {
            _imagemAtividadeRdRepository = imagemSeparacaoRepository;

            _atividadeRdRepository = atividadeRdRepository;

            _logAcoesUsuarioService = logAcoesUsuarioService;

            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<ImagemAtividadeRd>> GetAllAsync()
        {
            try
            {
                return await _imagemAtividadeRdRepository.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
        public async Task<ImagemAtividadeRd> GetByIdAsync(int? id)
        {
            try
            {
                return await _imagemAtividadeRdRepository.GetByIdAsync(id);
            }
            catch
            {
                throw;
            }
        }

    public async Task<List<ImagemAtividadeRd>> GetAllImagensInAtividade(int? id)
    {
        try
        {
            var all = await _imagemAtividadeRdRepository.GetAllAsync();

            return all.Where(x=>x.AtividadeRdId == id).ToList();

        }
        catch
        {
            throw;
        }
    }



    public async Task<ImagemAtividadeRd> CreateAsync(ImagemAtividadeRd model)
        {
            try
            {
                var all = await _imagemAtividadeRdRepository.GetAllAsync();

                model.DataAdicao = DateTime.UtcNow.AddHours(-3);

                var imagemAtividadeRd = await _imagemAtividadeRdRepository.CreateAsync(model);

                var atividade = await _atividadeRdRepository.GetByIdAsync(model.AtividadeRdId);

                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Imagem adicionada a Atividade Nº{atividade.NumeroAtividade} do Relatório Diário Nº{atividade.RelatorioRdId} por {userName} ",
                    responsavel: userName);
                
                await _logAcoesUsuarioService.CreateAsync(log);
                
                var lastItem = all.TakeLast(1).ToList();

                imagemAtividadeRd.Id = lastItem[0].Id + 1;

                 return imagemAtividadeRd;

            }

            catch
            {
                throw;
            }
        }

        public async Task<ImagemAtividadeRd> UpdateAsync(ImagemAtividadeRd model)
        {
            try
            {
                var material = await _imagemAtividadeRdRepository.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();

                await _imagemAtividadeRdRepository.UpdateAsync(material);

                return material;

            }
            catch
            {
                throw;
            }
        }
        public async Task DeleteAsync(int id)
        {
            try
            {

                await _imagemAtividadeRdRepository.DeleteAsync(id);
            }
            catch
            {
                throw;
            }

        }

}