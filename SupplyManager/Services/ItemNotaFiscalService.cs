using SupplyManager.App;
using SupplyManager.Interfaces;

namespace SupplyManager.Services
{
    public class ItemNotaFiscalService
    {
        private readonly  IItemNotaFiscalRepository _itemNotaFiscalRepository;

        public ItemNotaFiscalService(IItemNotaFiscalRepository itemNotaFiscalRepository)
        {
            _itemNotaFiscalRepository = itemNotaFiscalRepository;
        }


    }
}
