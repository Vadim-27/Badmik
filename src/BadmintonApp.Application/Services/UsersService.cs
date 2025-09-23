﻿using AutoMapper;
using BadmintonApp.Application.DTOs.Users;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Users;
using BadmintonApp.Domain.Core;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public class UserService : IUsersService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IValidator<RegisterDto> _userRegisterValidation;
        
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IPasswordHasher<User> passwordHasher, IValidator<RegisterDto> userRegisterValidation,  IMapper mapper)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _userRegisterValidation = userRegisterValidation;            
            _mapper = mapper;
        }

        public async Task RegisterAsync(RegisterDto dto, CancellationToken cancellationToken)
        {
            await _userRegisterValidation.ValidateAndThrowAsync(dto, cancellationToken);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                DoB = dto.DoB,
                ClubId = dto.ClubId,               
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
            await _userRepository.CreateAsync(user, cancellationToken);

        }

        public async Task<UserResultDto> GetByIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user == null) throw new NotFoundException("User not found.");
            
            return MapToProfile(user); // використати автомапер.
        }

        public async Task<UserResultDto> GetProfileAsync(Guid currentUserId, CancellationToken cancellationToken) // два однакових методи, чи э в них обох неохыднысть?
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
            if (user == null) throw new NotFoundException("User not found.");

            //await _updateUserValidation.ValidateAndThrowAsync(dto, cancellationToken);

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;            

            await _userRepository.UpdateAsync(user, cancellationToken);

            return _mapper.Map<UserResultDto>(user);            
        }

        public async Task DeleteAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
            if (user == null) throw new NotFoundException("User not found");

            await _userRepository.DeleteAsync(user, cancellationToken);
        }

        private UserResultDto MapToProfile(User user) => new UserResultDto
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,            
            DoB = user.DoB
        };
    }
}
