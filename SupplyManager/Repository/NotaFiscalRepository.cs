using SupplyManager.App;

namespace SupplyManager.Repository
{
    public class NotaFiscalRepository
    {
        private readonly SqlContext _context;

        public NotaFiscalRepository(SqlContext context)
        {
          _context = context;
        }

    }
}
