using BadmintonApp.Application.Interfaces;
using BadmintonApp.Application.Services;
using BadmintonApp.Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IUsersService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            
            return services;
        }
    }
}
