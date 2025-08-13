using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Users;
using BadmintonApp.Application.Exсeptions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Users;
using BadmintonApp.Domain.Users;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public class UserService : IUsersService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserService(IUserRepository userRepository, IPasswordHasher<User> passwordHasher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task RegisterAsync(RegisterDto dto, CancellationToken cancellationToken)
        {
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email, cancellationToken);
            if (existingUser != null)
                throw new BadRequestException("Email already exists");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                DoB = dto.DoB,
                Role = dto.Role,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
            await _userRepository.CreateAsync(user, cancellationToken);
           
        }

        public async Task<UserResultDto> GetByIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            return user == null ? null : MapToProfile(user);
        }

        public async Task<UserResultDto> GetProfileAsync(Guid currentUserId, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(currentUserId, cancellationToken);
            return user == null ? null : MapToProfile(user);
        }

        public async Task<List<UserResultDto>> GetAllAsync(CancellationToken cancellationToken)
        {
            var users = await _userRepository.GetAllAsync(cancellationToken);
            return users.Select(MapToProfile).ToList();
        }

        public async Task<UserResultDto> UpdateAsync(Guid userId, UpdateUserDto dto, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user == null) return ResultDto.Fail<UserResultDto>("User not found");

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Role = dto.Role;

            await _userRepository.UpdateAsync(user, cancellationToken);
            return ResultDto.Success<UserResultDto>();
        }

        public async Task<ResultDto> DeleteAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user == null) return ResultDto.Fail<UserResultDto>("User not found");

            await _userRepository.DeleteAsync(user, cancellationToken);
            return ResultDto.Success<UserResultDto>();
        }

        private UserResultDto MapToProfile(User user) => new UserResultDto
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            DoB = user.DoB
        };
    }
}
