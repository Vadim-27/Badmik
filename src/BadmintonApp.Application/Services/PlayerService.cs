using AutoMapper;
using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Paginations;
using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.Interfaces.Permissions;
using BadmintonApp.Application.Interfaces.Players;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Transactions;
using BadmintonApp.Application.Interfaces.Users;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Enums.Permission;
using BadmintonApp.Domain.Players;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services;

public class PlayerService : IPlayerService
{
    private readonly IPlayerRepository _playerRepository;
    private readonly IMapper _mapper;
    private readonly IUsersService _usersService;
    private readonly ITransactionService _transactionService;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IValidator<CreatePlayerDto> _playerRegisterValidation;
    private readonly IPermissionService _permissionService;
    private readonly ICurrentUserContext _current;

    public PlayerService(IPlayerRepository playerRepository, IMapper mapper, IUsersService usersService, ITransactionService transactionService, IUserRepository userRepository, IPasswordHasher<User> passwordHasher, IValidator<CreatePlayerDto> playerRegisterValidation, IPermissionService permissionService, ICurrentUserContext current)
    {
        _playerRepository = playerRepository;
        _mapper = mapper;
        _usersService = usersService;
        _transactionService = transactionService;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _playerRegisterValidation = playerRegisterValidation;
        _permissionService = permissionService;
        _current = current;
    }

    public async Task Create(CreatePlayerDto dto, CancellationToken cancellationToken)
    {
        await _playerRegisterValidation.ValidateAndThrowAsync(dto, cancellationToken);
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PhoneNumber = dto.PhoneNumber,
            DoB = dto.DoB,
            ClubId = dto.ClubId,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
        await _userRepository.CreateAsync(user, cancellationToken);

        var player = new Player
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            ClubId = dto.ClubId
        };

        await _playerRepository.Create(player, cancellationToken);

        var sportProfilesDto = new UpdatePlayerSportProfilesDto
        {
            SportProfiles = dto.SportProfiles
        };
        await this.UpdateSportProfilesAsync(player.Id, sportProfilesDto, cancellationToken);

    }

    public async Task<PlayerDto> GetById(Guid Id, CancellationToken cancellationToken)
    {
        var player = await _playerRepository.GetById(Id, cancellationToken);
        return _mapper.Map<PlayerDto>(player);
    }

    public async Task<PlayerDto> GetByUserId(Guid Id, CancellationToken cancellationToken)
    {
        var player = await _playerRepository.GetByUserId(Id, cancellationToken);
        return _mapper.Map<PlayerDto>(player);
    }

    public async Task Update(UpdatePlayerDto dto, CancellationToken cancellationToken)
    {       
        var player = _mapper.Map<Player>(dto);       
        var playerRepo = await _playerRepository.GetById(dto.Id, cancellationToken);       
        var user = await _userRepository.GetByIdAsync(playerRepo.UserId, cancellationToken);
        
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Email = dto.Email;


        await _transactionService.Begin(cancellationToken);
        try
        {           
            await _userRepository.UpdateAsync(user, cancellationToken);            
            await _playerRepository.Update(player, cancellationToken);            
            await _transactionService.Commit(cancellationToken);
        }
        catch (Exception)
        {
            await _transactionService.RollBack(cancellationToken);

            throw;
        }
    }

    public async Task<PaginationListDto<PlayerDto>> GetAll(ClubPaginationFilterDto paginationFilterDto, CancellationToken cancellationToken)
    {
        var players = await _playerRepository.GetAll(paginationFilterDto, cancellationToken);

        var mapped = _mapper.Map<List<PlayerDto>>(players.List);

        return new PaginationListDto<PlayerDto>
        {
            List = mapped,
            TotalCount = players.TotalCount,
            Page = players.Page,
            PageSize = players.PageSize
        };
    }

    public async Task ChangePassword(PlayerUpdatePasswordDto playerUpdateDto, CancellationToken cancellationToken)
    {
        var player = await _playerRepository.GetById(playerUpdateDto.PlayerId, cancellationToken);
        if (player == null)
        {
            throw new KeyNotFoundException("Player not found");
        }
        var user = await _userRepository.GetByIdAsync(player.UserId, cancellationToken);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }   

        var passwordHash = _passwordHasher.HashPassword(user, playerUpdateDto.Password);
        await _userRepository.UpdatePasswordAsync(user.Id, passwordHash, cancellationToken);
    }

    public async Task UpdateSportProfilesAsync(Guid playerId, UpdatePlayerSportProfilesDto dto, CancellationToken ct = default)
    {
        if (playerId == Guid.Empty) throw new BadRequestException("playerId is empty.");

        var player = await _playerRepository.GetById(playerId, ct)
            ?? throw new NotFoundException($"Player '{playerId}' not found.");

        var actorUserId = _current.UserId;
        var actorClubId = _current.ClubId;

        var isSelf = player.UserId == actorUserId;

        if (!isSelf)
        {
            var allowed = await _permissionService.HasPermission(
                actorUserId, actorClubId, PermissionType.PlayersManage, ct);

            if (!allowed)
                throw new ForbiddenException("Missing permission to manage players.");

            if (player.ClubId != actorClubId)
                throw new ForbiddenException("Cannot manage players from another club.");
        }

        var newProfiles = dto.SportProfiles
            .Select(x => new PlayerSportProfile
            {
                PlayerId = playerId,
                Sport = x.Sport,
                Level = x.Level
            })
            .ToList();

        await _playerRepository.UpdateSportProfilesAsync(playerId, newProfiles, ct);
    }
}
