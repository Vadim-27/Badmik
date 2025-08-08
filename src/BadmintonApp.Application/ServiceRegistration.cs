using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.Interfaces.Permissions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Trainings;
using BadmintonApp.Application.Interfaces.Users;
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
            //services.AddScoped<IUserRoleRepository, UserRoleRepository>()
            services.AddAutoMapper(conf => conf.AddMaps(Assembly.GetExecutingAssembly()));
            services.AddScoped<IPermissionService, PermissionService>();
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

            return services;
        }
    }
}
