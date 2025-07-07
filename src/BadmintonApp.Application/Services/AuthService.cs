using BadmintonApp.Application.DTOs.Auth;
using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.Interfaces;
using BadmintonApp.Domain.Users;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(IUserRepository userRepository,
                           IPasswordHasher<User> passwordHasher,
                           IJwtTokenGenerator jwtTokenGenerator)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<LoginResultDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
                return ResultDto.Fail<LoginResultDto>("Invalid credentials");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result != PasswordVerificationResult.Success)
                return ResultDto.Fail<LoginResultDto>("Invalid credentials");

            var token = _jwtTokenGenerator.GenerateToken(user);

            return new LoginResultDto
            {
                IsSuccess = true,
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role,
                FullName = $"{user.FirstName} {user.LastName}",
                ExpiresAt = DateTime.UtcNow.AddHours(2)
            };
        }

        public Task LogoutAsync()
        {
            throw new NotImplementedException();
        }
    }
}
