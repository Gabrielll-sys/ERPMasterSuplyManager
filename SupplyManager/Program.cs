using FluentValidation;
using FluentValidation.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using SupplyManager.App;
using SupplyManager.Interfaces;
using SupplyManager.Models;
using SupplyManager.Repository;
using SupplyManager.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

string mySqlConnection = builder.Configuration.GetConnectionString("SqlConnectionString");

builder.Services.AddDbContextPool<SqlContext>(options =>
options.UseMySql(mySqlConnection, new MySqlServerVersion(new Version())
));
builder.Services.AddDbContextPool<SqlContext>(options =>

options.UseMySql(mySqlConnection, ServerVersion.AutoDetect(mySqlConnection)));


#region Swagger Documentation  Configuration
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        //Versão da API
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

app.UseAuthorization();

app.MapControllers();

app.Run();

