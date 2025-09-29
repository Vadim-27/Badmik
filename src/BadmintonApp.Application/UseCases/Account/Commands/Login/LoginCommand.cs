using MediatR;

namespace BadmintonApp.Application.UseCases.Account.Commands.Login;

public class LoginCommand : IRequest<LoginResultModel>
{
    public string Email { get; set; }
    public string Password { get; set; }
}
