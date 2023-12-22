using FluentValidation;
using FluentValidation.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using SupplyManager.App;
using SupplyManager.Models;

using System;
using System.Collections.Generic;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

string mySqlConnection = builder.Configuration.GetConnectionString("SqlConnectionString");

builder.Services.AddDbContextPool<SqlContext>(options =>
options.UseMySql(mySqlConnection, new MySqlServerVersion(new Version())
));
builder.Services.AddDbContextPool<SqlContext>(options =>

options.UseMySql(mySqlConnection, ServerVersion.AutoDetect(mySqlConnection)));

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

