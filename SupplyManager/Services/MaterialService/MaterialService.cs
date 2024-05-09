using System.Security.Claims;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class MaterialService:IMaterialService
    {
        private readonly IMaterialRepository _materialRepository;

        private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;

        private readonly IHttpContextAccessor _httpContextAccessor;
        public MaterialService(IMaterialRepository materialRepository,ILogAcoesUsuarioService logAcoesUsuarioService, IHttpContextAccessor httpContextAccessor)
        {
            _materialRepository = materialRepository;

            _logAcoesUsuarioService = logAcoesUsuarioService;

            _httpContextAccessor = httpContextAccessor;
        }
        
         public async Task<List<Material>> GetAllAsync()
        {
            try
            {
                return await _materialRepository.GetAllAsync();
            }
            catch
            {
                throw;
            }
        }
         public async Task<Material> GetByIdAsync(int id)
        {
            try
            {
                var material = await _materialRepository.GetByIdAsync(id);

                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Editando Material {material.Id} - {material.Descricao}",
                    responsavel: userName);

                await _logAcoesUsuarioService.CreateAsync(log);
                return material;
            }
            catch
            {
                throw;
            }
        }

        public async Task<Material> CreateAsync(Material model)
        {
            try
            {
                var all = await _materialRepository.GetAllAsync();

                Material m1 = new Material(
                model.CodigoInterno.ToUpper(),
                model.CodigoFabricante.ToUpper(),
                model.Descricao.ToUpper(),
                model.Categoria.ToUpper(),
                model.Marca.ToUpper(),
                String.IsNullOrEmpty(model.Corrente) ? "-" : model.Corrente.ToUpper(),
                model.Unidade,
                String.IsNullOrEmpty(model.Tensao) ? "-" : model.Tensao,
                String.IsNullOrEmpty(model.Localizacao) ? "-" : model.Localizacao.ToUpper(),
                model.DataEntradaNF,
                model.PrecoCusto,
                model.Markup

              );

                var material = await _materialRepository.CreateAsync(m1);

                var lastItem = all.TakeLast(1).ToList(); 
                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
                
                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Criação do Material {material.Descricao}",
                    responsavel: userName);
                
                await _logAcoesUsuarioService.CreateAsync(log);

                material.Id = lastItem[0].Id + 1;

                return material;

            }

            catch
            {
                throw;
            }
        }

        public async Task<Material> UpdateAsync(Material model)
        {
            try
            {
                var material =  await _materialRepository.GetByIdAsync(model.Id) ?? throw new KeyNotFoundException();


                material.CodigoInterno = model.CodigoInterno.ToUpper();
                material.CodigoFabricante = model.CodigoFabricante.ToUpper();
                material.Descricao = model.Descricao.ToUpper();
                material.Categoria = model.Categoria.ToUpper();
                material.Marca = model.Marca.ToUpper();
                material.Corrente = model.Corrente.ToUpper();
                material.Unidade = model.Unidade.ToUpper();
                material.Tensao = String.IsNullOrEmpty(model.Tensao) ? "-" : model.Tensao;
                material.Localizacao = String.IsNullOrEmpty(model.Localizacao) ? "-" : model.Localizacao.ToUpper();
                material.DataEntradaNF = model.DataEntradaNF;
                material.PrecoCusto = model.PrecoCusto;
                material.PrecoVenda = model.PrecoVenda;
                material.Markup = model.Markup;

                
                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

                LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização do Material de Codigo Interno Nº {model.Id}",
                    responsavel: userName);
                
                await _logAcoesUsuarioService.CreateAsync(log);
                
                await _materialRepository.UpdateAsync(material);

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

            await _materialRepository.DeleteAsync(id);
            }
            catch
            {
                throw;
            }

        }

      

       
    }
}
