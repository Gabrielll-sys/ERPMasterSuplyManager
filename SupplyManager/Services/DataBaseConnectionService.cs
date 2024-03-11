using Dapper;
using MySqlConnector;
using SupplyManager.Interfaces;

namespace SupplyManager.Services
{
    public class DataBaseConnectionService:IDataBaseConnectionService
    {
        private string _connectionString = "server=localhost;database=MasterERP;user=root;password=1234";

        public async Task<IEnumerable<T>> QueryAsync<T>(string sql)
        {
            using (var conexao = new MySqlConnection(_connectionString))
            {
                await conexao.OpenAsync();
                return await conexao.QueryAsync<T>(sql);
            }
        }
    }
}
