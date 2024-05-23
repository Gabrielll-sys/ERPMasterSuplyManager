using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
namespace MasterErp.Services
{
    public class ItemService:IItemService
    {
        private readonly IItemRepository _itemRepository;

        public ItemService(IItemRepository itemRepository)
        {
            itemRepository = itemRepository;
        }


    }
}
