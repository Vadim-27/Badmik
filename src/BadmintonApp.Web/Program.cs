using BadmintonApp.Web.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseStaticFiles();
app.UseRouting();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies[AuthConstants.AuthCookieName];
                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            }
        };
    });
app.MapRazorPages();
app.UseAuthorization();
app.MapFallbackToFile("/index.html");
app.Use(async (context, next) =>
{
    await next();

    // only for HTML pages (not API)
    if (context.Response.StatusCode == 401 &&
        context.Request.Path.StartsWithSegments("/"))
    {
        context.Response.Redirect("/login");
    }
});
builder.Services.AddHttpClient();
app.Run();
