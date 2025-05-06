using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MasterErp.Infraestructure.Context;
using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Services.Interfaces;       // Interfaces de Serviço
using MasterErp.Services.Services;         // Implementações de Serviço
using System.Text;
using System.Text.Json.Serialization;      // Para ignorar ciclos em JSON
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
using Microsoft.AspNetCore.Http;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Infraestructure;
using MasterErp.Services;
using Microsoft.AspNetCore.Mvc;           // Para IHttpContextAccessor

var builder = WebApplication.CreateBuilder(args);

// 1. Configuração de Serviços Essenciais (DbContext, Autenticação, etc.)
// =======================================================================

// Configuração do DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
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
var key = Encoding.ASCII.GetBytes(builder.Configuration["JwtSettings:SecretKey"]); 
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
builder.Services.AddScoped<IClienteRepository, ClienteRepository>(); // Adicionado para consistência
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



// NOVOS SERVIÇOS PARA FORMULÁRIOS
builder.Services.AddScoped<IFormTemplateService, FormTemplateService>();
builder.Services.AddScoped<IFilledFormService, FilledFormService>();

// Se você criou repositórios específicos para formulários, registre-os aqui:
// builder.Services.AddScoped<IFormTemplateRepository, FormTemplateRepository>();
// builder.Services.AddScoped<IFilledFormInstanceRepository, FilledFormInstanceRepository>();


// 3. Configuração do AutoMapper
// ==============================
// Escaneia todos os assemblies carregados (incluindo MasterErp.Services)
// em busca de classes que herdam de AutoMapper.Profile e as registra.
// Isso inclui o seu novo FormMappingProfile.
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


// 4. Configuração do FluentValidation (ESTILO ATUALIZADO)
// ======================================================
builder.Services.AddControllers()
    .AddJsonOptions(options => // Configuração para lidar com referências cíclicas em JSON
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull; // Opcional: Não serializar nulos
    });

// Registra todos os validadores do assembly que contém 'FilledFormSyncDtoValidator'.
// Se seus validadores existentes (como UsuarioPostValidator) estiverem no mesmo
// assembly (MasterErp.Services.dll), esta única linha é suficiente para todos.
// O ServiceLifetime.Scoped é comum para validadores.
builder.Services.AddValidatorsFromAssemblyContaining<FilledFormSyncDtoValidator>(ServiceLifetime.Scoped);

// Se por acaso UsuarioPostValidator (ou outros validadores mais antigos) estiverem em um assembly DIFERENTE
// do que FilledFormSyncDtoValidator (que está em MasterErp.Services.Validators.Forms),
// você precisaria de uma linha para cada assembly.
// Ex: builder.Services.AddValidatorsFromAssemblyContaining<UsuarioPostValidator>(ServiceLifetime.Scoped); // Se UsuarioPostValidator estiver em MasterErp.Services.Validators

// Habilita a validação automática do FluentValidation para ASP.NET Core.
// Isso fará com que os validadores registrados sejam executados automaticamente
// para os modelos nas actions dos seus controllers.
builder.Services.AddFluentValidationAutoValidation(config =>
{
    // Opcional: Desabilitar a validação padrão do DataAnnotations se você só usa FluentValidation.
    // Isso evita que as validações sejam executadas duas vezes se você tiver ambos.
    config.DisableDataAnnotationsValidation = true;


});

// Se você precisar de adaptadores para validação do lado do cliente (menos comum para APIs puras):
// builder.Services.AddFluentValidationClientsideAdapters();


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
