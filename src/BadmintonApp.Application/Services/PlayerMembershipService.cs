using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Players;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Enums.Player;
using BadmintonApp.Domain.Players;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public class PlayerMembershipService : IPlayerMembershipService
    {
        private readonly IPlayerMembershipRepository _repo;
        private readonly IPlayerRepository _playerRepo;

        public PlayerMembershipService(IPlayerMembershipRepository repo, IPlayerRepository playerRepo)
        {
            _repo = repo;
            _playerRepo = playerRepo;
        }

        public async Task<List<MembershipDto>> GetAllAsync(Guid playerId, Guid? clubId, CancellationToken ct)
        {
            // optional: ensure player exists
            _ = await _playerRepo.GetById(playerId, ct);

            var memberships = await _repo.GetByPlayerIdAsync(playerId, clubId, ct);

            return memberships.Select(ToDto).ToList();
        }

        public async Task<MembershipDto> GetByIdAsync(Guid playerId, Guid membershipId, CancellationToken ct)
        {
            var membership = await _repo.GetByIdAsync(membershipId, ct);
            if (membership is null)
                throw new NotFoundException("Membership not found.");

            if (membership.PlayerId != playerId)
                throw new NotFoundException("Membership not found.");

            return ToDto(membership);
        }

        public async Task<Guid> CreateAsync(Guid playerId, CreateMembershipDto dto, CancellationToken ct)
        {
            // optional: ensure player exists
            _ = await _playerRepo.GetById(playerId, ct);

            var membership = new PlayerClubMembership
            {
                Id = Guid.NewGuid(),
                PlayerId = playerId,
                ClubId = dto.ClubId,
                Status = MembershipStatus.Active,
                ValidFrom = dto.ValidFrom,
                ValidUntil = dto.ValidUntil,
                TrainingsLeft = dto.TrainingsGranted,
                TrainingsTotalGranted = dto.TrainingsGranted
            };

            await _repo.CreateAsync(membership, ct);

            return membership.Id;
        }

        public async Task UpdateAsync(Guid playerId, Guid membershipId, UpdateMembershipDto dto, CancellationToken ct)
        {
            var membership = await _repo.GetByIdAsync(membershipId, ct);
            if (membership is null)
                throw new NotFoundException("Membership not found.");

            if (membership.PlayerId != playerId)
                throw new NotFoundException("Membership not found.");

            membership.Status = dto.Status;
            membership.ValidFrom = dto.ValidFrom;
            membership.ValidUntil = dto.ValidUntil;

            await _repo.UpdateAsync(membership, ct);
        }

        public async Task DeleteAsync(Guid playerId, Guid membershipId, CancellationToken ct)
        {
            var membership = await _repo.GetByIdAsync(membershipId, ct);
            if (membership is null)
                return; // idempotent delete

            if (membership.PlayerId != playerId)
                throw new NotFoundException("Membership not found.");

            await _repo.DeleteAsync(membership, ct);
        }

        private static MembershipDto ToDto(PlayerClubMembership m) => new()
        {
            Id = m.Id,
            ClubId = m.ClubId,
            Status = m.Status,
            ValidFrom = m.ValidFrom,
            ValidUntil = m.ValidUntil,
            TrainingsLeft = m.TrainingsLeft,
            TrainingsTotalGranted = m.TrainingsTotalGranted
        };
    }
}
