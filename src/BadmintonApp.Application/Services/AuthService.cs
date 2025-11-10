using BadmintonApp.Application.DTOs.Auth;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Core;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IStaffRoleRepository _staffRoleRepository;
    private readonly IStaffRepository _staffRepository;

    public AuthService(IUserRepository userRepository,
                       IPasswordHasher<User> passwordHasher,
                       IJwtTokenGenerator jwtTokenGenerator
                       , IStaffRoleRepository userRoleRepository
        , IStaffRepository staffRepository)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _staffRoleRepository = userRoleRepository;
        _staffRepository = staffRepository;
    }

    public async Task<LoginResultDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email, cancellationToken);
        if (user == null) throw new BadRequestException("Invalid credentials");

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

        if (result != PasswordVerificationResult.Success) throw new BadRequestException("Invalid credentials");

        var staff = await _staffRepository.GetByUserAndClubId(user.Id, user.ClubId.Value, cancellationToken);
        if (staff == null) throw new BadRequestException("User is not staff member");

        var roles = await _staffRoleRepository.GetStaffRoleForClubAsync(staff.Id, user.ClubId.Value, cancellationToken);
        
        var permissionTypes = roles.Where(r => r.RolePermissions != null)
            .SelectMany(r => r.RolePermissions)
            .Where(rp => rp.Permission != null)
            .Select(rp => rp.Permission.Type)
            .Distinct()
            .ToArray();

        var token = _jwtTokenGenerator.GenerateToken(user, permissionTypes);

        return new LoginResultDto
        {
            Token = token,
            UserId = user.Id.ToString(),
            Email = user.Email,
            FullName = $"{user.FirstName} {user.LastName}",
            ExpiresAt = DateTime.UtcNow.AddHours(2),
            IsAdmin = user.IsAdmin
        };
    }



    public Task LogoutAsync()
    {
        throw new NotImplementedException();
    }
}
