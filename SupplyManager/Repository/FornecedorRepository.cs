using SupplyManager.App;

namespace SupplyManager.Repository
{
    public class FornecedorRepository
    {
        private readonly SqlContext _context;

        public FornecedorRepository(SqlContext context)
        {
            _context = context;
        }

    }
}
