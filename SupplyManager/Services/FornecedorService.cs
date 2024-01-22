using SupplyManager.Interfaces;

namespace SupplyManager.Services
{
    public class FornecedorService
    {
        private readonly IFornecedorRepository _fornecedorRepository;

        public FornecedorService(IFornecedorRepository fornecedorRepository)
        {
            _fornecedorRepository = fornecedorRepository;
        }


    }
}
