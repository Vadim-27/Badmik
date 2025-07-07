using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Users;
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
    public class UserService : IUsersService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserService(IUserRepository userRepository, IPasswordHasher<User> passwordHasher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task<UserResultDto> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                return ResultDto.Fail<UserResultDto>("Email already exists");

            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                DoB = dto.DoB,
                Role = dto.Role,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
            await _userRepository.CreateAsync(user);

            return ResultDto.Success<UserResultDto>();
        }

        public async Task<UserResultDto> GetByIdAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return user == null ? null : MapToProfile(user);
        }

        public async Task<UserResultDto> GetProfileAsync(string currentUserId)
        {
            var user = await _userRepository.GetByIdAsync(currentUserId);
            return user == null ? null : MapToProfile(user);
        }

        public async Task<List<UserResultDto>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(MapToProfile).ToList();
        }

        public async Task<UserResultDto> UpdateAsync(string userId, UpdateUserDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return ResultDto.Fail<UserResultDto>("User not found");

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Role = dto.Role;

            await _userRepository.UpdateAsync(user);
            return ResultDto.Success<UserResultDto>();
        }

        public async Task<ResultDto> DeleteAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return ResultDto.Fail<UserResultDto>("User not found");

            await _userRepository.DeleteAsync(user);
            return ResultDto.Success<UserResultDto>();
        }

        private UserResultDto MapToProfile(User user) => new UserResultDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            DoB = user.DoB
        };
    }
}
