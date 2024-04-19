using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using SupplyManager.App;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Services;

namespace SupplyManager.Repository;

public class ImagemAtividadeRdService:IImagemAtividadeRdRepository
{
      private readonly IImagemAtividadeRdRepository _imagemAtividadeRdRepository;

        private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;

        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public ImagemAtividadeRdService(IImagemAtividadeRdRepository imageServicoRepository,ILogAcoesUsuarioService logAcoesUsuarioService, IHttpContextAccessor httpContextAccessor)
        {
            _imagemAtividadeRdRepository = imageServicoRepository;

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
        
       

        
        public async Task<ImagemAtividadeRd> CreateAsync(ImagemAtividadeRd model)
        {
            try
            {
                var all = await _imagemAtividadeRdRepository.GetAllAsync();


                var imagemAtividadeRd = await _imagemAtividadeRdRepository.CreateAsync(model);

                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Adição de Imagem ao Relatorio Diário Nº{model.AtividadeRdId}",
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