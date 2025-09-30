using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.UseCases.Account.Commands.Login;

public class LoginResultModel
{
    public string Token { get; set; }
    public string RefreshToken { get; set; }

    public DateTime? ExpiresAt { get; set; }

    public string UserId { get; set; }
    public string[] Roles { get; set; }
    public IEnumerable<string> Permissions { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }
}
