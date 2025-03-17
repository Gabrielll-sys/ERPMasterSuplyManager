using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
namespace PingFunction
{


    public class PingFunction
    {

        private static readonly HttpClient _httpClient;

        const string urlPing = "";

   
        [Function("PingFunction")]

        public async Task Run([TimerTrigger("0 */1 * * * *")] TimerInfo myTimer,ILogger log)
        {
            log.LogInformation("Função Executada as " + DateTime.Now);

            var response = _httpClient.GetAsync(urlPing);
            var content =  await _httpClient.GetStringAsync(urlPing);

            Console.WriteLine(content);
            if (response is not null) log.LogInformation("Request realizado");
  
        }
    }
}
