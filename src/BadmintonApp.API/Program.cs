using BadmintonApp.API.Middlewares;
using BadmintonApp.Application;
using BadmintonApp.Infrastructure;
using BadmintonApp.Infrastructure.Logger;
using BadmintonApp.Infrastructure.Persistence;
using BadmintonApp.Infrastructure.Persistence.Seed;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;
using System.Text.Json.Serialization;

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

    // за бажанням — поріг рівня:
    return true;
});

builder.Services.AddLogging(l =>
{
    l.ClearProviders();
    l.AddConsole();
    l.AddProvider(new DbLoggerProvider(builder.Services.BuildServiceProvider()
                       .GetRequiredService<ApplicationDbContext>()));
});

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    //dbContext.Database.EnsureCreated();
    dbContext.Database.Migrate();
    await DbInitializer.SeedAsync(dbContext);
}

app.Run();