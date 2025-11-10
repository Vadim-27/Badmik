using BadmintonApp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using System.Linq;

namespace BadmintonApp.Api.Tests.Fixtures
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override IHost CreateHost(IHostBuilder builder)
        {
            builder.UseEnvironment("Test");

            
            builder.ConfigureAppConfiguration((context, config) =>
            {
                
                var built = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.Test.json", optional: true, reloadOnChange: false)
                    .AddEnvironmentVariables()
                    .Build();

                
                var overrides = new Dictionary<string, string?>
                {
                    ["Jwt:Key"] = built["Jwt:Key"],
                    ["Jwt:Issuer"] = built["Jwt:Issuer"],
                    ["Jwt:Audience"] = built["Jwt:Audience"],

                    
                    ["DbProvider"] = "InMemory"
                };

                config.AddInMemoryCollection(overrides!);
            });

            builder.ConfigureServices(services =>
            {
                
                var dbContextDesc = services.FirstOrDefault(d => typeof(DbContext).IsAssignableFrom(d.ServiceType));
                if (dbContextDesc is not null) services.Remove(dbContextDesc);

                
                services.AddDbContext<ApplicationDbContext>(o =>
                {
                    o.UseInMemoryDatabase("BadmintonApp_TestDb");
                });
            });

            var host = base.CreateHost(builder);


            return host;
        }

        public HttpClient CreateClientWithBasePath()
        {
            return CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        }
    }
}