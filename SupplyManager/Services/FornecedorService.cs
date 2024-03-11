using SupplyManager.Interfaces;
using SupplyManager.Models;

namespace SupplyManager.Services
{
    public class FornecedorService : IFornecedorService
    {
        private readonly IFornecedorRepository _fornecedorRepository;

        public FornecedorService(IFornecedorRepository fornecedorRepository)
        {
            _fornecedorRepository = fornecedorRepository;
        }

        public async Task<Fornecedor> CreateAsync(Fornecedor model)
        {
            try
            {


                var all = await _fornecedorRepository.GetAllAsync();

                await _fornecedorRepository.CreateAsync(model);

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
                await _fornecedorRepository.DeleteAsync(id);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<Fornecedor>> GetAllAsync()
        {
            try
            {
                return await _fornecedorRepository.GetAllAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Fornecedor> GetByIdAsync(int id)
        {
            try
            {
                 return  await _fornecedorRepository.GetByIdAsync(id);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Fornecedor> UpdateAsync(Fornecedor model)
        {
            try
            {
               var a =  await _fornecedorRepository.UpdateAsync(model);
                return a;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
