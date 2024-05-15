
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SupplyManager.App;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;
using SupplyManager.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

string mySqlConnection = builder.Configuration.GetConnectionString("SqlConnectionString");

builder.Services.AddDbContextPool<SqlContext>(options =>
options.UseMySql(mySqlConnection, new MySqlServerVersion(new Version())
));
builder.Services.AddDbContextPool<SqlContext>(options =>

options.UseMySql(mySqlConnection, ServerVersion.AutoDetect(mySqlConnection)));
builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RoleCreateUser", policy => policy.RequireRole("Diretor"));
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    // Adding Jwt Bearer
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Ry74cBQva5dThwbwchR9jhbtRFnJxWSZ"))
        };
    });



#region Swagger Documentation  Configuration
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        //Vers�o da API
        Version = "v1.0",
        Title = "Master ERP API",
        Description = "Service to get informations and manage the services of Master ERP"
    });

    var xmlFileName = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlFilePath = Path.Combine(AppContext.BaseDirectory, xmlFileName);
    options.IncludeXmlComments(xmlFilePath);
});
#endregion



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




// Add services to the container.



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddTransient<IInventarioService, InventarioService>();
builder.Services.AddScoped<IInventarioRepository, InventarioRepository>();
builder.Services.AddTransient<IMaterialService, MaterialService>();
builder.Services.AddScoped<IMaterialRepository, MaterialRepository>();
builder.Services.AddScoped<IFornecedorService, FornecedorService>();
builder.Services.AddScoped<IFornecedorRepository, FornecedorRepository>();
builder.Services.AddTransient<INotaFiscalService, NotaFiscalService>();
builder.Services.AddScoped<INotaFiscalRepository, NotaFiscalRepository>();
builder.Services.AddTransient<IItemNotaFiscalService, ItemNotaFiscalService>();
builder.Services.AddScoped<IItemNotaFiscalRepository, ItemNotaFiscalRepository>();
builder.Services.AddScoped<IOrcamentoRepository, OrcamentoRepository>();
builder.Services.AddTransient<IOrcamentoService, OrcamentoService>();
builder.Services.AddScoped<IOrdemServicoRepository, OrdemServicoRepository>();
builder.Services.AddTransient<IOrdemServicoService, OrdemServicoService>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddTransient<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<ILogAcoesUsuarioRepository, LogAcoesUsuarioRepository>();
builder.Services.AddTransient<ILogAcoesUsuarioService, LogAcoesUsuarioService>();
builder.Services.AddScoped<IClienteRepository, ClientRepository>();
builder.Services.AddTransient<IAtividadeRdService, AtividadeRdService>();
builder.Services.AddScoped<IRelatorioDiarioRepository, RelatorioDiarioRepository>();
builder.Services.AddTransient<IRelatorioDiarioService, RelatorioDiarioService>();
builder.Services.AddTransient<IHttpContextAccessor, HttpContextAccessor>();

var app = builder.Build();
// Configure the HTTP request pipeline.
    app.UseSwagger();
    app.UseSwaggerUI();
/*if (app.Environment.IsDevelopment())
{
}
*/

app.UseCors(option => option.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

