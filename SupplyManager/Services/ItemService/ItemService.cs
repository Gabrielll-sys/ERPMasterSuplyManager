using SupplyManager.Interfaces;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class ItemService:IItemService
    {
        private readonly ItemRepository _itemRepository;

        public ItemService(ItemRepository itemRepository)
        {
            itemRepository = itemRepository;
        }


    }
}
