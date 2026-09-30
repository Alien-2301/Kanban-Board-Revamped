
//register the database context
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // see enum, write string name, not num index
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// in memory version
// builder.Services.AddDbContext<TodoContext>(
//     opt => opt.UseInMemoryDatabase("TodoList"));

Console.WriteLine($"Working directory: {Directory.GetCurrentDirectory()}");
// sqlite3 version
builder.Services.AddDbContext<TodoContext>(
    opt => opt.UseSqlite("Data Source=TodoList.db"));

// Azure SQL / SQL server
// builder.Services.AddDbContext<TodoContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("MvcMovieContext") ?? throw new InvalidOperationException("Connection string 'MvcMovieContext' not found.")));
// Angular's dev server runs on localhost:4200 by default. Without this,
// the browser blocks the API calls with a CORS error.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // configuring Swagger MiddleWare 
    // avoid exposing data on the production
    app.UseSwaggerUi(options => {
        options.DocumentPath = "/openapi/v1.json";
    });
}

app.UseCors("AllowAngularDev");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();