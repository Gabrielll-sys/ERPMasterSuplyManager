using FluentValidation;
using FluentValidation.Internal;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using SupplyManager.App;
using SupplyManager.Models;

var builder = WebApplication.CreateBuilder(args);

string mySqlConnection = builder.Configuration.GetConnectionString("SqlConnectionString");

/*builder.Services.AddDbContextPool<SqlContext>(options =>
options.UseMySql(mySqlConnection, new MySqlServerVersion(new Version())
));*/
builder.Services.AddDbContextPool<SqlContext>(options =>

options.UseMySql(mySqlConnection, ServerVersion.AutoDetect(mySqlConnection)));


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors(option => option.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

