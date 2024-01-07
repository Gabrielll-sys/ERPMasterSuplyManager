using SupplyManager.Interfaces;
using SupplyManager.Repository;

namespace SupplyManager.Services
{
    public class MaterialService:IMaterialService
    {
        private readonly MaterialRepository _materialRepository;

        public MaterialService(MaterialRepository materialRepository)
        {
            _materialRepository = materialRepository;
        }

    }
}
