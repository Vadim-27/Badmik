using BadmintonApp.API.Middlewares;
using BadmintonApp.Application;
using BadmintonApp.Domain.Logs;
using BadmintonApp.Infrastructure;
using BadmintonApp.Infrastructure.Logger;
using BadmintonApp.Infrastructure.Persistence;
using BadmintonApp.Infrastructure.Persistence.Seed;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "BadmintonApp API",
        Version = "v1"

    });
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorisation",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Input JwtToken in format: {token}"
    });
    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                     Type = ReferenceType.SecurityScheme,
                     Id = "Bearer"
                },
            },
            Array.Empty<string>()
        }
    });
});

builder.Services
    .AddControllers();


builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
{

    opt.TokenValidationParameters = new()
    {
        ValidateIssuerSigningKey = true,

        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),

        ValidateIssuer = false,

        ValidateAudience = false,
    };
});

builder.Logging.AddFilter<DbLoggerProvider>((category, level) =>
{
    if (category.StartsWith("Microsoft.") ||
        category.StartsWith("System.") ||
        category.StartsWith("Microsoft.EntityFrameworkCore") ||
        category.StartsWith("Microsoft.AspNetCore"))
        return false;
    
    return true;
});

builder.Services.AddLogging(l =>
{
    l.ClearProviders();
    l.AddConsole();
    l.AddProvider(new DbLoggerProvider(builder.Services.BuildServiceProvider()
                       .GetRequiredService<ApplicationDbContext>()));
});

builder.Services.AddCors(o =>
{
    o.AddPolicy("Ngrok", p =>
        p.WithOrigins("https://*.ngrok-free.app")
         .SetIsOriginAllowedToAllowWildcardSubdomains()
         .AllowAnyHeader()
         .AllowAnyMethod());
});


var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var retries = 5;
    while (retries-- > 0)
    {
        try { db.Database.Migrate(); break; }
        catch (Exception ex)
        {
            Console.WriteLine($"Migration failed: {ex.Message}. Retrying...");
            await Task.Delay(2000);
        }
    }
}

app.MapGet("/__db", (ApplicationDbContext db) => Results.Text(db.Database.ProviderName));
// ----- SECURE MIGRATION ENDPOINT -----
app.MapPost("/__migrate", async (HttpContext ctx, IServiceScopeFactory scopeFactory, IConfiguration cfg, ILogger<Program> log) =>
{
    var tokenHeader = ctx.Request.Headers["X-Migrate-Token"].ToString();
    var tokenConfig = cfg["MIGRATE_TOKEN"];
    //if (string.IsNullOrEmpty(tokenConfig) || tokenHeader != tokenConfig)
    //    return Results.Unauthorized();

    try
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // якщо БД ще не існує — створимо каталоги
        var creator = db.Database.GetService<IRelationalDatabaseCreator>();
        if (!await creator.ExistsAsync())
            await creator.CreateAsync();

        await db.Database.MigrateAsync();

        // Run initializer
        await DbInitializer.SeedAsync(db);
        return Results.Ok("✅ Migrations applied successfully");
    }
    catch (Exception ex)
    {
        log.LogError(ex, "Migration failed");
        return Results.Problem(detail: ex.ToString(), statusCode: 500, title: "Migration failed");
    }
});
app.UseCors("Ngrok");
app.Run();
public partial class Program { }