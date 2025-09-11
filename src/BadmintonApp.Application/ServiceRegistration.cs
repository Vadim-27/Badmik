using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.Interfaces.Clubs;
using BadmintonApp.Application.Interfaces.Logs;
using BadmintonApp.Application.Interfaces.Permissions;
using BadmintonApp.Application.Interfaces.Trainings;
using BadmintonApp.Application.Interfaces.Users;
using BadmintonApp.Application.Mappings;
using BadmintonApp.Application.Services;
using BadmintonApp.Domain.Users;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace BadmintonApp.Application
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IUsersService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITrainingsService, TrainingsService>();
            services.AddValidatorsFromAssemblyContaining<UserService>(includeInternalTypes: true);            
            services.AddAutoMapper(conf => conf.AddMaps(Assembly.GetAssembly(typeof(TrainingMappingProfile))));
            services.AddScoped<IPermissionService, PermissionService>();
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            services.AddScoped<ILogService, LogService>();
            services.AddScoped<IClubsService, ClubsService>();

            return services;
        }
    }
}
