using SupplyManager.Interfaces;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class OrdemServicoService: IOrdemServicoService
    {
        private readonly InventarioRepository _ordemServicoRepository;

        public OrdemServicoService(InventarioRepository ordemServicoRepository)
        {
            _ordemServicoRepository = ordemServicoRepository;
        }








    }
}
