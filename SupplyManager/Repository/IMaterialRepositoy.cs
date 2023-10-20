using SupplyManager.Models;

namespace SupplyManager.Repository
{
    public interface IMaterialRepositoy
    {

         Task<Inventario> GetById(int id);


         Task<List<Inventario>> GetAll();


         Task UpdateInventario(Inventario inventario);


        Task DeleteInventario(int id);
       
    }
}
