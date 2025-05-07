using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MasterErp.Infraestructure.Context;
using MasterErp.Domain.Interfaces.Repository;

using MasterErp.Services.Interfaces;       // Interfaces de Serviço
using MasterErp.Services.Services;         // Implementações de Serviço
using System.Text;
using System.Text.Json.Serialization;      // Para ignorar ciclos em JSON e para JsonStringEnumConverter
using FluentValidation;                    // Para FluentValidation
using FluentValidation.AspNetCore;         // Para integração ASP.NET Core do FluentValidation (AddFluentValidationAutoValidation)
using MasterErp.Services.Validators.Forms; // Namespace dos seus novos validadores de formulário
using MasterErp.Services.Validators;       // Namespace de validadores existentes (ex: UsuarioPostValidator)
using MasterErp.Services.Interfaces.Forms; // Interfaces dos novos serviços de formulário
using MasterErp.Services.Services.Forms;   // Implementações dos novos serviços de formulário
// Se você criou repositórios específicos para formulários, adicione os usings:
// using MasterErp.Domain.Interfaces.Repository.Forms;
// using MasterErp.Infraestructure.Repository.Forms;
using System.Security.Claims;              // Para ClaimTypes
using Microsoft.AspNetCore.Http;           // Para IHttpContextAccessor
using Microsoft.AspNetCore.Mvc;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Services;
using MasterErp.Infraestructure; // Para ApiVersion

var builder = WebApplication.CreateBuilder(args);

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

// Registro do IHttpContextAccessor
builder.Services.AddHttpContextAccessor();

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

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", // Nome da política
        policy =>
        {
            policy.AllowAnyOrigin() // Permite qualquer origem (cuidado em produção)
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});


// 2. Registro dos Seus Serviços de Negócio (Existentes e Novos)
// ==============================================================

// Seus serviços existentes
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IMaterialRepository, MaterialRepository>();
builder.Services.AddScoped<IMaterialService, MaterialService>();
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IOrcamentoRepository, OrcamentoRepository>();
builder.Services.AddScoped<IOrcamentoService, OrcamentoService>();
builder.Services.AddScoped<IOrdemServicoRepository, OrdemServicoRepository>();
builder.Services.AddScoped<IOrdemServicoService, OrdemServicoService>();
builder.Services.AddScoped<IInventarioRepository, InventarioRepository>();
builder.Services.AddScoped<IInventarioService, InventarioService>();
builder.Services.AddScoped<ILogAcoesUsuarioRepository, LogAcoesUsuarioRepository>();
builder.Services.AddScoped<ILogAcoesUsuarioService, LogAcoesUsuarioService>();
builder.Services.AddScoped<IAtividadeRdRepository, AtividadeRdRepository>();
builder.Services.AddScoped<IAtividadeRdService, AtividadeRdService>();
builder.Services.AddScoped<IRelatorioDiarioRepository, RelatorioDiarioRepository>();
builder.Services.AddScoped<IRelatorioDiarioService, RelatorioDiarioService>();

builder.Services.AddScoped<IImagemAtividadeRdRepository, ImagemAtividadeRdRepository>(); // Adicionado se não estiver
builder.Services.AddScoped<IImagemAtividadeRdService, ImagemAtividadeRdService>();   // Adicionado se não estiver
builder.Services.AddScoped<ITarefaUsuarioRepository, TarefaUsuarioRepository>();     // Adicionado se não estiver
builder.Services.AddScoped<ITarefaUsuarioService, TarefaUsuarioService>();       // Adicionado se não estiver


// NOVOS SERVIÇOS PARA FORMULÁRIOS
builder.Services.AddScoped<IFormTemplateService, FormTemplateService>();
builder.Services.AddScoped<IFilledFormService, FilledFormService>();


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
        // ADICIONADO: Configura a desserialização de Enums como strings
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddValidatorsFromAssemblyContaining<FilledFormSyncDtoValidator>(ServiceLifetime.Scoped);
// Se UsuarioPostValidator estiver em um assembly diferente, adicione outra linha para ele:
// builder.Services.AddValidatorsFromAssemblyContaining<UsuarioPostValidator>(ServiceLifetime.Scoped);

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

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAllOrigins"); // Aplica a política de CORS definida acima
app.UseAuthentication(); // Habilita a autenticação (DEVE VIR ANTES DO UseAuthorization)
app.UseAuthorization();  // Habilita a autorização
app.MapControllers(); // Mapeia os atributos de rota nos seus controllers

app.Run();
