using MasterErp.Infraestructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

// Certifique-se de que o namespace aqui corresponde ao namespace do seu SqlContext
// Exemplo: namespace MasterErp.Infraestructure.Context
// Se o SqlContext estiver em MasterErp.Infraestructure.Context,
// e esta factory estiver no mesmo projeto/namespace, não há problema.
// Caso contrário, adicione a diretiva 'using' apropriada para SqlContext.

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<SqlContext>
{
    public SqlContext CreateDbContext(string[] args)
    {
        // Configuração para ler o appsettings.json
        // Isso assume que o appsettings.json está no diretório de saída do projeto
        // que está executando a migração (geralmente o projeto de inicialização).
        // Se o seu appsettings.json estiver em um local diferente em tempo de design,
        // você pode precisar ajustar o SetBasePath.
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory()) // Obtém o diretório do projeto que executa a migração
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true) // Carrega o appsettings.json
            .Build();

        var builder = new DbContextOptionsBuilder<SqlContext>();
        var connectionString = configuration.GetConnectionString("SqlConnectionString");

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Não foi possível encontrar a connection string 'DefaultConnection' no appsettings.json.");
        }

        // Aplica a mesma configuração que você usou no Program.cs
        builder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), mySqlOptions =>
            mySqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: System.TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null)
            .MigrationsAssembly(typeof(SqlContext).Assembly.FullName) // Garante que as migrações sejam encontradas no assembly do SqlContext
        );

        return new SqlContext(builder.Options);
    }
}