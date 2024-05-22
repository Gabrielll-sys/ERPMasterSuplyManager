using System.Security.Claims;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;

namespace MasterErp.Services
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


                var m1 = new Material(
                            model.CodigoInterno,
                            model.CodigoFabricante,
                            model.Descricao,
                            model.Categoria,
                            model.Marca,
                            model.Corrente,
                            model.Unidade,
                            model.Tensao,
                            model.Localizacao,
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


                var userName = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;

                if (model.Localizacao != material.Localizacao)

                {
                    LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização da Localização do Material Nº {model.Id}",
                                   responsavel: userName);

                    await _logAcoesUsuarioService.CreateAsync(log);

                }

                if (model.Descricao != material.Descricao)

                {
                    LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização da Descrição do Material Nº {model.Id}",
                                   responsavel: userName);

                    await _logAcoesUsuarioService.CreateAsync(log);

                }

              

                if (model.PrecoCusto != material.PrecoCusto)

                {
                    LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização do Preço de Custo do Material Nº {model.Id}",
                                   responsavel: userName);

                    await _logAcoesUsuarioService.CreateAsync(log);

                }

                if (model.PrecoVenda != material.PrecoVenda)

                {
                    LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização do Preço de Venda do Material Nº {model.Id}",
                                   responsavel: userName);

                    await _logAcoesUsuarioService.CreateAsync(log);

                }

                if (model.Markup != material.Markup)

                {
                    LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização do Markup do Material Nº {model.Id}",
                                   responsavel: userName);

                    await _logAcoesUsuarioService.CreateAsync(log);

                }

                if (model.Marca != material.Marca)

                {
                    LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização da Marca do Material Nº {model.Id}",
                                   responsavel: userName);

                    await _logAcoesUsuarioService.CreateAsync(log);

                }
                if (model.Tensao != material.Tensao)

                {
                    LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização da Tensão do Material Nº {model.Id}",
                                   responsavel: userName);

                    await _logAcoesUsuarioService.CreateAsync(log);

                }

                if (model.Unidade != material.Unidade)

                {
                    LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização da Unidade do Material Nº {model.Id}",
                                   responsavel: userName);

                    await _logAcoesUsuarioService.CreateAsync(log);

                }

                if (model.CodigoFabricante != material.CodigoFabricante)

                {
                    LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização do Codigo de Fabricante do Material Nº {model.Id}",
                                   responsavel: userName);

                    await _logAcoesUsuarioService.CreateAsync(log);

                }

                if (model.Corrente != material.Corrente)

                {
                    LogAcoesUsuario log = new LogAcoesUsuario(acao: $"Atualização da Corrente do Material Nº {model.Id}",
                                   responsavel: userName);

                    await _logAcoesUsuarioService.CreateAsync(log);

                }

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
