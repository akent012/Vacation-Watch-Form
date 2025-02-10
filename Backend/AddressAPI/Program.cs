using AddressAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

//Console.WriteLine($"Globalization Invariant Mode: {Environment.GetEnvironmentVariable("DOTNET_SYSTEM_GLOBALIZATION_INVARIANT")}");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();


// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting(); // Ensures routing is available

app.UseCors("AllowAll"); // Apply CORS policy

app.UseAuthorization(); // Must be placed after UseRouting and before UseEndpoints

app.UseEndpoints(endpoints =>
{
    // Log all registered routes for debugging
    foreach (var endpoint in endpoints.DataSources.SelectMany(ds => ds.Endpoints))
    {
        Console.WriteLine($"Registered endpoint: {endpoint.DisplayName}");
    }
});

// Map controller routes
app.MapControllers();

app.Run();
