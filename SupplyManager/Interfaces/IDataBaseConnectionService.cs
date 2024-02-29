namespace SupplyManager.Interfaces
{
    public interface IDataBaseConnectionService
    {

        public Task<IEnumerable<T>> QueryAsync<T>(string sql);

    }    
}