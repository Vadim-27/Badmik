using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.Interfaces.Clubs;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Services;
using BadmintonApp.Domain.Users;
using BadmintonApp.Infrastructure.Auth;
using BadmintonApp.Infrastructure.Persistence;
using BadmintonApp.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BadmintonApp.Infrastructure
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                //options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
                options.UseSqlite(configuration.GetConnectionString("DefaultConnection"), options => options.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IClubsService, ClubsService>();
            services.AddScoped<IClubsRepository, ClubRepository>();
            services.AddScoped<IUserRoleRepository, UserRoleRepository>();
            
            services.AddScoped<ITrainingsRepository, TrainingsRepository>();

            return services;
        }
    }
}
