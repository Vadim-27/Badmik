using BadmintonApp.Application.DTOs.Auth;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Core;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.UseCases.Account.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResultModel>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IUserRoleRepository _userRoleRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public LoginCommandHandler(IUserRepository userRepository, IPasswordHasher<User> passwordHasher, IUserRoleRepository userRoleRepository, IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _userRoleRepository = userRoleRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
    }
    public async Task<LoginResultModel> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user == null) throw new BadRequestException("Invalid credentials");

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (result != PasswordVerificationResult.Success) throw new BadRequestException("Invalid credentials");

        var roles = await _userRoleRepository.GetUserRoleForClubAsync(user.Id, user.ClubId.Value, cancellationToken);

        var token = _jwtTokenGenerator.GenerateToken(user, roles.Select(x => x.Name).ToArray());

        return new LoginResultModel
        {
            Token = token,
            UserId = user.Id.ToString(),
            Email = user.Email,
            Roles = roles.Select(x => x.Name).ToArray(),
            Permissions = roles.SelectMany(x => x.RolePermissions.Select(x => x.Permission.Name)),
            FullName = $"{user.FirstName} {user.LastName}",
            ExpiresAt = DateTime.UtcNow.AddHours(2)
        };
    }
}
