using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.Interfaces.Clubs;
using BadmintonApp.Application.Interfaces.Logs;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Transactions;
using BadmintonApp.Application.Interfaces.Users;
using BadmintonApp.Application.Services;
using BadmintonApp.Domain.Core;
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
            services.AddScoped<IClubsRepository, ClubRepository>();
            services.AddScoped<IUserRoleRepository, UserRoleRepository>();            
            services.AddScoped<ILogRepository, LogRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IPermissionRepository, PermissionRepository>();
            services.AddScoped<IPlayerRepository, PlayerRepository>();
            services.AddScoped<IStaffRepository, StaffRepository>();
            services.AddScoped<ITrainingsRepository, TrainingsRepository>();
            services.AddScoped<ITransactionService, TransactionService>();

            return services;
        }
    }
}
