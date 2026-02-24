using AutoMapper;
using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Application.DTOs.Paginations;
using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Extension;
using BadmintonApp.Application.Extesions;
using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.Interfaces.Permissions;
using BadmintonApp.Application.Interfaces.Players;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Transactions;
using BadmintonApp.Application.Interfaces.Users;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Media;
using BadmintonApp.Domain.Enums.Permission;
using BadmintonApp.Domain.Players;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
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
    private readonly IMediaRepository _mediaRepository;

    public PlayerService(IPlayerRepository playerRepository, IMapper mapper, IUsersService usersService, ITransactionService transactionService, IUserRepository userRepository, IPasswordHasher<User> passwordHasher, IValidator<CreatePlayerDto> playerRegisterValidation, IPermissionService permissionService, ICurrentUserContext current, IMediaRepository mediaRepository)
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
        _mediaRepository = mediaRepository;
    }

    public async Task Create(CreatePlayerDto dto, CancellationToken cancellationToken)
    {
        await _playerRegisterValidation.ValidateAndThrowAsync(dto, cancellationToken);

        await EnsureCanManagePlayerAsync(null, PermissionType.PlayersManage, cancellationToken);

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
            Gender = dto.Gender,
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

    public async Task<PlayerDto> GetById(Guid id, CancellationToken cancellationToken)
    {
        var player = await _playerRepository.GetById(id, cancellationToken);
        var dto = _mapper.Map<PlayerDto>(player);

        await AttachPlayerPhotosAsync(new List<Player> { player }, new List<PlayerDto> { dto }, cancellationToken);

        return dto;
    }

    public async Task<PlayerDto> GetByUserId(Guid id, CancellationToken cancellationToken)
    {
        var player = await _playerRepository.GetByUserId(id, cancellationToken);
        var dto = _mapper.Map<PlayerDto>(player);

        await AttachPlayerPhotosAsync(new List<Player> { player }, new List<PlayerDto> { dto }, cancellationToken);

        return dto;
    }

    public async Task Update(UpdatePlayerDto dto, CancellationToken cancellationToken)
    {       
        var playerRepo = await _playerRepository.GetById(dto.Id, cancellationToken);       
        var user = await _userRepository.GetByIdAsync(playerRepo.UserId, cancellationToken);

        await EnsureCanManagePlayerAsync(playerRepo, PermissionType.PlayersManage, cancellationToken);

        user.Email = dto.Email;
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.PhoneNumber = dto.PhoneNumber;
        user.DoB = dto.DoB;
        user.Gender = dto.Gender;

        await _transactionService.Begin(cancellationToken);
        try
        {           
            await _userRepository.UpdateAsync(user, cancellationToken);
            var sportProfilesDto = new UpdatePlayerSportProfilesDto { SportProfiles = dto.SportProfiles };
            await this.UpdateSportProfilesAsync(playerRepo.Id, sportProfilesDto, cancellationToken);
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
        var page = await _playerRepository.GetAll(paginationFilterDto, cancellationToken);

        var dtoPage = page.AsPagination<Player, PlayerDto>(_mapper);

        await AttachPlayerPhotosAsync(page.List, dtoPage.List, cancellationToken);

        return dtoPage;
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

        await EnsureCanManagePlayerAsync(player, PermissionType.PlayersManage, cancellationToken);

        var passwordHash = _passwordHasher.HashPassword(user, playerUpdateDto.Password);
        await _userRepository.UpdatePasswordAsync(user.Id, passwordHash, cancellationToken);
    }

    public async Task UpdateSportProfilesAsync(Guid playerId, UpdatePlayerSportProfilesDto dto, CancellationToken ct = default)
    {
        if (playerId == Guid.Empty) throw new BadRequestException("playerId is empty.");

        var player = await _playerRepository.GetById(playerId, ct)
            ?? throw new NotFoundException($"Player '{playerId}' not found.");

        await EnsureCanManagePlayerAsync(player, PermissionType.PlayersManage, ct);

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

    public async Task<List<PlayerDto>> GetByIdsAsync(List<Guid> ids, CancellationToken ct)
    {
        if (ids == null || ids.Count == 0)
            return new List<PlayerDto>();

        // optional guard
        if (ids.Count > 2000)
            throw new ArgumentException("Too many ids.");

        // IMPORTANT: keep the original order (followers often depend on it)
        // Also keep duplicates? Usually no => distinct.
        var orderedDistinctIds = ids.Distinct().ToList();

        var players = await _playerRepository.GetByIdsAsync(orderedDistinctIds, ct);

        // Fast lookup
        var map = players.ToDictionary(p => p.Id, p => p);

        var result = new List<PlayerDto>(orderedDistinctIds.Count);
        foreach (var id in orderedDistinctIds)
        {
            if (!map.TryGetValue(id, out var p)) continue;

            result.Add(_mapper.Map<PlayerDto>(p));
        }
        await AttachPlayerPhotosAsync(players, result, ct);
        return result;
    }

    #region "helpers"
    private async Task AttachPlayerPhotosAsync(List<Player> players, List<PlayerDto> dtos, CancellationToken ct) 
    {
        if (players.Count == 0 || dtos.Count == 0)
            return;

        var playerIds = players.Select(p => p.Id).Distinct().ToList();

        // bulk load media by PLAYER ids
        var media = await _mediaRepository.GetListAsync(EntityType.Player, playerIds, MediaKind.Avatar, ct);

        // playerId -> primary media (OwnerId == playerId)
        var primaryByPlayerId = media.PickPrimaryPerOwner();

        foreach (var dto in dtos)
        {
            if (primaryByPlayerId.TryGetValue(dto.Id, out var mediaItem))
            {
                dto.PhotoUrl = mediaItem.Url; //mediaItem.ThumbUrl;
            }
        }
    }

    private async Task EnsureCanManagePlayerAsync(Player player, PermissionType permissionIfNotSelf, CancellationToken ct)
    {
        
        var actorUserId = _current.UserId;
        var actorClubId = _current.ClubId;

        if (player != null && player.UserId == actorUserId)
            return; // self allowed

        var allowed = await _permissionService.HasPermissionByUserId(actorUserId, actorClubId, permissionIfNotSelf, ct);

        if (!allowed)
            throw new ForbiddenException($"Missing permission '{permissionIfNotSelf}'.");

        if (player != null && player.ClubId != actorClubId)
            throw new ForbiddenException("Cannot manage players from another club.");
    }
    #endregion
}
