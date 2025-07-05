var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseStaticFiles();
app.UseRouting();
app.MapRazorPages();
app.MapFallbackToFile("/index.html");
app.Run();
