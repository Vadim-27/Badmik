using AutoMapper;
using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.Interfaces.Players;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Transactions;
using BadmintonApp.Application.Interfaces.Users;
using BadmintonApp.Domain.Core;
using System;
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

    public PlayerService(IPlayerRepository playerRepository, IMapper mapper, IUsersService usersService, ITransactionService transactionService, IUserRepository userRepository)
    {
        _playerRepository = playerRepository;
        _mapper = mapper;
        _usersService = usersService;
        _transactionService = transactionService;
        _userRepository = userRepository;
    }

    public async Task<PlayerDto> GetById(Guid Id, CancellationToken cancellationToken)
    {
        var player = await _playerRepository.GetById(Id, cancellationToken);
        return _mapper.Map<PlayerDto>(player);
    }

    public async Task Update(PlayerUpdateDto dto, CancellationToken cancellationToken)
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
}
