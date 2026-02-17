using AutoMapper;
using BadmintonApp.Application.DTOs.Booking;
using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.Interfaces.Players;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Validation;
using BadmintonApp.Application.Validation.Players;
using BadmintonApp.Domain.Enums.Player;
using BadmintonApp.Domain.Players;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace BadmintonApp.Application.Services
{
    public class PlayerMembershipService : IPlayerMembershipService
    {
        private readonly IPlayerMembershipRepository _membershipRepository;
        private readonly IPlayerRepository _playerRepo;
        private readonly IMapper _mapper;
        private readonly UpdateMembershipDtoValidator _updateMembershipValidator;
        private readonly CreateMembershipDtoValidator _createMembershipValidator;
        private readonly IPaymentRepository _paymentRepo;
        private readonly IClubMembershipPlanRepository _planRepository;
        private readonly ICurrentUserContext _current;
        private readonly IValidator<RenewMembershipDto> _renewValidator;
        private readonly IValidator<CreateMembershipPurchaseDto> _purchaseValidator;

        public PlayerMembershipService(IPlayerMembershipRepository repo, IPlayerRepository playerRepo, IMapper mapper,UpdateMembershipDtoValidator updateMembershipValidator, CreateMembershipDtoValidator createMembershipValidator, IValidator<RenewMembershipDto> renewValidator, IPaymentRepository paymentRepository, ICurrentUserContext current, IClubMembershipPlanRepository planRepo, IValidator<CreateMembershipPurchaseDto> purchaseValidator)
        {
            _membershipRepository = repo;
            _playerRepo = playerRepo;
            _mapper = mapper;
            _createMembershipValidator = createMembershipValidator;
            _updateMembershipValidator = updateMembershipValidator;
            _renewValidator = renewValidator;
            _paymentRepo = paymentRepository;
            _planRepository = planRepo;
            _current = current;
            _purchaseValidator = purchaseValidator;
        }

        public async Task<List<MembershipDto>> GetAllAsync(Guid playerId, Guid? clubId, CancellationToken ct)
        {
            // optional: ensure player exists
            _ = await _playerRepo.GetById(playerId, ct);

            var memberships = await _membershipRepository.GetByPlayerIdAsync(playerId, clubId, ct);
            return _mapper.Map<List<MembershipDto>>(memberships.ToList());
        }

        public async Task<MembershipDto> GetByIdAsync(Guid playerId, Guid membershipId, CancellationToken ct)
        {
            var membership = await _membershipRepository.GetByIdAsync(membershipId, ct);
            if (membership is null)
                throw new NotFoundException("Membership not found.");

            if (membership.PlayerId != playerId)
                throw new NotFoundException("Membership not found.");

            return _mapper.Map<MembershipDto>(membership);
        }

        public async Task<MembershipDto> CreateAsync(Guid playerId, CreateMembershipDto dto, CancellationToken ct)
        {
            await _createMembershipValidator.ValidateAndThrowAsync(dto, ct);
            var validFrom = dto.ValidFrom;
            var validUntil = dto.ValidUntil ?? dto.ValidFrom.AddDays(3650); // або як у тебе
            await EnsureNoActiveOverlapAsync(playerId, dto.ClubId, validFrom, validUntil, excludeMembershipId: null, ct);

            // optional: ensure player exists
            _ = await _playerRepo.GetById(playerId, ct);

            var membership = _mapper.Map<PlayerClubMembership>(dto);
            membership.PlayerId = playerId;
            await _membershipRepository.CreateAsync(membership, ct);

            return _mapper.Map<MembershipDto>(membership);
        }

        public async Task<MembershipDto> UpdateAsync(Guid playerId, Guid membershipId, UpdateMembershipDto dto, CancellationToken ct)
        {
            var membership = await _membershipRepository.GetByIdAsync(membershipId, ct);
            if (membership is null)
                throw new NotFoundException("Membership not found.");

            if (membership.PlayerId != playerId)
                throw new NotFoundException("Membership not found.");

            await _updateMembershipValidator.ValidateAndThrowAsync(dto, ct);

            membership = _mapper.Map<PlayerClubMembership>(dto);
            membership.PlayerId = playerId;
            await _membershipRepository.UpdateAsync(membership, ct);

            return _mapper.Map<MembershipDto>(membership);
        }

        public async Task DeleteAsync(Guid playerId, Guid membershipId, CancellationToken ct)
        {
            var membership = await _membershipRepository.GetByIdAsync(membershipId, ct);
            if (membership is null)
                return; // idempotent delete

            if (membership.PlayerId != playerId)
                throw new NotFoundException("Membership not found.");

            await _membershipRepository.DeleteAsync(membership, ct);
        }

        public async Task<MembershipDto> RenewAsync(Guid playerId, RenewMembershipDto dto, CancellationToken ct)
        {
            if (playerId == Guid.Empty) throw new BadRequestException("playerId is empty.");

            await _renewValidator.ValidateAndThrowAsync(dto, ct);

            var plan = await _planRepository.GetById(dto.PlanId, ct)
                ?? throw new NotFoundException($"Plan '{dto.PlanId}' not found.");

            if (plan.ClubId != dto.ClubId)
                throw new BadRequestException("Plan does not belong to this club.");

            if (!plan.IsActive)
                throw new BadRequestException("Plan is not active.");

            var now = DateTime.UtcNow;

            // ✅ auto-shift
            var membership = await _membershipRepository.GetLatestAsync(playerId, dto.ClubId, ct);

            var validFrom = membership.ValidUntil.HasValue
                ? (membership.ValidUntil.Value == DateTime.MaxValue
                    ? throw new BadRequestException("Player already has active membership without end date.")
                    : membership.ValidUntil.Value)
                : now;

            var validUntil = validFrom.AddDays(plan.DurationDays);

            var membershipFromDto = new PlayerClubMembership
            {
                Id = Guid.NewGuid(),
                PlayerId = playerId,
                ClubId = dto.ClubId,
                PlanId = plan.Id,
                Status = MembershipStatus.Active,
                ValidFrom = validFrom,
                ValidUntil = validUntil,
                TrainingsLeft = plan.TrainingsGranted,
                TrainingsTotalGranted = plan.TrainingsGranted,
                UpdatedAtUtc = DateTime.UtcNow
            };

            await _membershipRepository.CreateAsync(membershipFromDto, ct);

            return _mapper.Map<MembershipDto>(membershipFromDto);
        }

        public async Task<MembershipDto> PurchaseAsync(CreateMembershipPurchaseDto dto, CancellationToken ct)
        {
            var vr = await _purchaseValidator.ValidateAsync(dto, ct);
            if (!vr.IsValid)
                throw new BadRequestException(vr.Errors.First().ErrorMessage); // replace with your ExceptionFactory if needed

            // plan
            var plan = await _planRepository.GetById(dto.PlanId, ct)
                ?? throw new NotFoundException($"Plan '{dto.PlanId}' not found.");

            if (plan.ClubId != dto.ClubId)
                throw new BadRequestException("Plan does not belong to this club.");

            if (!plan.IsActive)
                throw new BadRequestException("Plan is not active.");

            var now = DateTime.UtcNow;

            // shift using GetLatestAsync (same logic as renew)
            var latest = await _membershipRepository.GetLatestAsync(dto.PlayerId, dto.ClubId, ct);

            DateTime validFrom;

            if (latest is not null &&
                latest.Status == MembershipStatus.Active &&
                (latest.ValidUntil ?? DateTime.MaxValue) > now)
            {
                if (latest.ValidUntil is null)
                    throw new BadRequestException("Player already has active membership without end date.");

                validFrom = latest.ValidUntil.Value;
            }
            else
            {
                validFrom = now;
            }

            var validUntil = validFrom.AddDays(plan.DurationDays);

            var membership = new PlayerClubMembership
            {
                Id = Guid.NewGuid(),
                PlayerId = dto.PlayerId,
                ClubId = dto.ClubId,
                PlanId = plan.Id,
                Status = MembershipStatus.Active,
                ValidFrom = validFrom,
                ValidUntil = validUntil,
                TrainingsLeft = plan.TrainingsGranted,
                TrainingsTotalGranted = plan.TrainingsGranted,
                UpdatedAtUtc = DateTime.UtcNow
            };

            await _membershipRepository.CreateAsync(membership, ct);

            return _mapper.Map<MembershipDto>(membership);
        }


        #region "private"
        private async Task EnsureNoActiveOverlapAsync(Guid playerId, Guid clubId, DateTime validFrom, DateTime validUntil, Guid? excludeMembershipId, CancellationToken ct)
        {
            if (validUntil <= validFrom)
                throw new BadRequestException("ValidUntil must be greater than ValidFrom.");

            var overlap = await _membershipRepository.HasOverlapAsync(playerId, clubId, validFrom, validUntil, excludeMembershipId, ct);

            if (overlap)
                throw new BadRequestException("Membership overlaps with an existing active membership for this club.");
        }

        

        #endregion
    }
}
