using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MasterErp.Infraestructure.Context;
using System.Text;
using System.Text.Json.Serialization;
using FluentValidation;
using FluentValidation.AspNetCore;

using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Services;
using MasterErp.Infraestructure;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.Extensions.Hosting;

var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
    ?? Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT")
    ?? Environments.Development;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    EnvironmentName = environmentName
});

// Configurar Kestrel para escutar em todas as interfaces (necessário para Expo Go)
// builder.WebHost.ConfigureKestrel(options =>
// {
//     options.ListenAnyIP(5285); // Escuta em 0.0.0.0:5285
// });

// 1. Configuração de Serviços Essenciais (DbContext, Autenticação, etc.)
// =======================================================================

// Configuração do DbContext
var connectionString = builder.Configuration.GetConnectionString("SqlConnectionString");
builder.Services.AddDbContext<SqlContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
    mySqlOptions => mySqlOptions.EnableRetryOnFailure(
        maxRetryCount: 5,
        maxRetryDelay: System.TimeSpan.FromSeconds(30),
        errorNumbersToAdd: null)
    .MigrationsAssembly(typeof(SqlContext).Assembly.FullName))
);

// Registro do IHttpContextAccessor e MemoryCache
builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();

// Configuração de Autenticação JWT
var secretKeyString = builder.Configuration["JwtSettings:SecretKey"];
if (string.IsNullOrEmpty(secretKeyString))
{
    throw new ArgumentNullException(nameof(secretKeyString), "A chave secreta JWT (JwtSettings:SecretKey) não foi encontrada ou está vazia na configuração. Verifique o appsettings.json.");
}
var key = Encoding.ASCII.GetBytes(secretKeyString);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Em desenvolvimento. Mude para true em produção.
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false, // Defina como true e configure ValidIssuer se necessário
        ValidateAudience = false, // Defina como true e configure ValidAudience se necessário
        NameClaimType = ClaimTypes.NameIdentifier // Ou o que você usa para o ID do usuário
    };
});

// Configuração do CORS segura para produção
const string corsPolicyName = "AllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicyName,
        policy =>
        {
            if (builder.Environment.IsDevelopment())
            {
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            }
            else
            {
                var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
                if (allowedOrigins != null && allowedOrigins.Length > 0)
                {
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                }
            }
        });
});


// 2. Registro Automático de Serviços de Negócio com Scrutor
// =========================================================
builder.Services.Scan(scan => scan
  .FromAssemblies(
        typeof(MasterErp.Services.UsuarioService).Assembly,
        typeof(MasterErp.Infraestructure.UsuarioRepository).Assembly
    )
    .AddClasses(classes => classes.AssignableTo<IScopedService>())
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(classes => classes.AssignableTo<ITransientService>())
        .AsImplementedInterfaces()
        .WithTransientLifetime()
    .AddClasses(classes => classes.AssignableTo<ISingletonService>())
        .AsImplementedInterfaces()
        .WithSingletonLifetime());

// 3. Configuração do AutoMapper
// ==============================
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


// 4. Configuração do FluentValidation e JSON Options
// =================================================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });


builder.Services.AddFluentValidationAutoValidation(config =>
{
    config.DisableDataAnnotationsValidation = true;
});

// 5. Configuração do Swagger/OpenAPI
// ======================================================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MasterErp API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header usando o esquema Bearer. <br/>
                      Entre com 'Bearer' [espaço] e então seu token no campo de texto abaixo. <br/>
                      Exemplo: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});
#region Api Versioning Configuration
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ReportApiVersions = true;
    options.AssumeDefaultVersionWhenUnspecified = true;
});

builder.Services.AddVersionedApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});
#endregion

// Construção da Aplicação
// =======================
var app = builder.Build();

// Configuração do Pipeline de Requisições HTTP
// ============================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MasterErp API V1");
    });
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseRouting();
app.UseCors(corsPolicyName); // Aplica a nova política de CORS
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

