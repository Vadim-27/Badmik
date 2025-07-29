using BadmintonApp.Web.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text;
using System.Text.Json;

namespace BadmintonApp.Web.Pages
{
    public class LoginModel : PageModel
    {
        [BindProperty]
        public InputModel Input { get; set; }

        private readonly IHttpClientFactory _clientFactory;

        public LoginModel(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        public void OnGet() { }

        public async Task<IActionResult> OnPostAsync()
        {
            var client = _clientFactory.CreateClient();
            var content = new StringContent(JsonSerializer.Serialize(Input), Encoding.UTF8, "application/json");

            var response = await client.PostAsync(AuthConstants.APIurl, content);

            if (!response.IsSuccessStatusCode)
            {
                ModelState.AddModelError(string.Empty, "Невірні дані для входу");
                return Page();
            }

            var json = await response.Content.ReadAsStringAsync();
            var payload = JsonDocument.Parse(json);
            var token = payload.RootElement.GetProperty("token").GetString();

            Response.Cookies.Append(AuthConstants.AuthCookieName, token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Redirect("/");
        }

        public class InputModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}
