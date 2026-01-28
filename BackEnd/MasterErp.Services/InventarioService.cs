
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;
using MasterErp.Domain.Models.Pagination;

namespace MasterErp.Services
{
    public class InventarioService : IInventarioService, IScopedService
    {
        private readonly IInventarioRepository _inventarioRepository;

        public InventarioService(IInventarioRepository inventarioRepository) 
        {
            _inventarioRepository = inventarioRepository;
        }


        public async Task<List<Inventario>> GetAllInventarioAsync()
        {
            try
            {
                return await _inventarioRepository.GetAllAsync();               

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<PagedResult<Inventario>> GetPagedAsync(PaginationParams paginationParams)
        {
            try
            {
                return await _inventarioRepository.GetPagedAsync(paginationParams);
            }
            catch (Exception)
            {
                throw;
            }
        }

        


        public async Task<Inventario> GetByIdAsync(int id)
        {
            try
            {

                return await _inventarioRepository.GetByIdAsync(id) ?? throw new KeyNotFoundException();

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Inventario> GetLastRegister(int id)
        {
            try
            {
                var inventory = await _inventarioRepository.GetByMaterialIdAsync(id);
                return inventory.OrderBy(x => x.Id).LastOrDefault();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Inventario> CreateAsync(Inventario model)
        {
            try
            {
                // Verifica se MaterialId é válido antes de prosseguir
                if (!model.MaterialId.HasValue)
                    throw new ArgumentException("MaterialId é obrigatório");
                    
                var invetory = await _inventarioRepository.GetByMaterialIdAsync(model.MaterialId.Value);

                if (invetory.Count == 0)
                {
                    Inventario invetory1 = new Inventario
                        (
                        model.Razao,
                        0,
                        model.Movimentacao,
                        model.SaldoFinal,
                        model.Responsavel,
                        model.MaterialId.Value
                        );

                    invetory1.EstoqueMovimentacao(model.SaldoFinal);
                    await _inventarioRepository.CreateAsync(invetory1);
                    return invetory1;
                }

                Inventario i1 = new Inventario
                                   (
                                   model.Razao,
                                   model.Estoque,
                                   model.Movimentacao,
                                   model.SaldoFinal,
                                   model.Responsavel,
                                   model.MaterialId.Value
                                   );

                i1.EstoqueMovimentacao(model.SaldoFinal);
                await _inventarioRepository.CreateAsync(i1);
                return i1;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<Inventario> RemoveQuantidadeEstoque(Inventario model)
        {
            try
            {
                Inventario i1 = new Inventario
                  (
                  model.Razao,
                  model.Estoque,
                  model.Movimentacao,
                  model.SaldoFinal,
                  model.Responsavel,
                  model.MaterialId.Value
                  );

                await _inventarioRepository.CreateAsync(i1);

                return (i1);
            }
            catch (Exception)
            {
                throw;

            }

        }
       

        public async Task<List<Inventario>> GetByCodigoFabricante(string codigoFabricante)
        {
            try
            {
                var all =  await _inventarioRepository.GetAllAsync();

                var inventarioWitchCodigoFabricante = all.Where(x=>x.Material.CodigoFabricante.Contains(codigoFabricante)).OrderBy(x=>x.Id);

                return (List<Inventario>)inventarioWitchCodigoFabricante;
                
            }
            catch (Exception)
            {
                throw;

            }
        }

        public async Task<List<Inventario>> GetByDescricao(string descricao)
        {
            try
            {
                var all = await _inventarioRepository.GetAllAsync();

                var inventarioWitchCodigoFabricante = all.Where(x => x.Material.Descricao.Contains(descricao)).OrderBy(x => x.Id);

                return (List<Inventario>)inventarioWitchCodigoFabricante;

            }
            catch (Exception)
            {
                throw;

            }
        }


      
        public async Task<Inventario> UpdateAsync(Inventario model)
        {
            try
            {
                await _inventarioRepository.UpdateAsync(model);

                return model;

            }
            catch (Exception)
            {
                throw;

            }
        }
    }
}
