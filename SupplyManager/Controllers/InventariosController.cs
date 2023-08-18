using Microsoft.AspNetCore.Mvc;
using SupplyManager.App;
using SupplyManager.Models;

namespace SupplyManager.Controllers
{
    public class InventariosController:ControllerBase
    {
        public readonly SqlContext _context;


        public InventariosController(SqlContext context)
        {

            _context = context;

        }

        [HttpGet]
        

        public async Task<List<Inventario>> GetAllInvetariosAsync()
        {

            try
            {


            }
            catch(Exception exception)
            {
                return StatusCode(StatusCode.s)

            }

        }
    }
}
