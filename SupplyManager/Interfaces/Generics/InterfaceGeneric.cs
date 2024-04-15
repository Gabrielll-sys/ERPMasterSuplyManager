namespace SupplyManager.Interfaces.Generics;

public interface InterfaceGeneric<T> where T: class
{
    
    Task<T> GetByIdAsync(int? id);
    
    Task<List<T>> GetAllAsync();

    Task<T> CreateAsync(T model);

    Task<T> UpdateAsync(T model);

    Task DeleteAsync(int id);
}