using AutoMapper;
using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Clubs;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public class ClubMembershipPlanService : IClubMembershipPlanService
    {
        private readonly IClubMembershipPlanRepository _repo;
        private readonly IMapper _mapper;

        public ClubMembershipPlanService(IClubMembershipPlanRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<List<ClubMembershipPlanDto>> GetByClub(Guid clubId, CancellationToken ct)
        {
            if (clubId == Guid.Empty) throw new BadRequestException("clubId is empty.");

            var plans = await _repo.GetByClubId(clubId, ct);
            return _mapper.Map<List<ClubMembershipPlanDto>>(plans);
        }

        public async Task<ClubMembershipPlanDto> GetById(Guid clubId, Guid planId, CancellationToken ct)
        {
            if (clubId == Guid.Empty) throw new BadRequestException("clubId is empty.");
            if (planId == Guid.Empty) throw new BadRequestException("planId is empty.");

            ClubMembershipPlan plan;
            try
            {
                plan = await _repo.GetById(planId, ct);
            }
            catch
            {
                throw new NotFoundException($"ClubMembershipPlan '{planId}' not found.");
            }

            if (plan.ClubId != clubId)
                throw new NotFoundException($"ClubMembershipPlan '{planId}' not found in club '{clubId}'.");

            return _mapper.Map<ClubMembershipPlanDto>(plan);
        }

        public async Task<ClubMembershipPlanDto> Create(Guid clubId, CreateClubMembershipPlanDto dto, CancellationToken ct)
        {
            if (clubId == Guid.Empty) throw new BadRequestException("clubId is empty.");

            var name = (dto.Name ?? "").Trim();
            if (string.IsNullOrWhiteSpace(name))
                throw new BadRequestException("Name is required.");

            // uniqueness per club
            var exists = await _repo.NameExists(clubId, name, excludePlanId: null, ct);
            if (exists)
                throw new BadRequestException($"Plan name '{name}' already exists for this club.");

            var plan = _mapper.Map<ClubMembershipPlan>(dto);

            var now = DateTime.UtcNow;
            plan.Id = Guid.NewGuid();
            plan.ClubId = clubId;
            plan.Name = name;
            plan.CreatedAtUtc = now;
            plan.UpdatedAtUtc = now;

            await _repo.Create(plan, ct);

            return _mapper.Map<ClubMembershipPlanDto>(plan);
        }

        public async Task<ClubMembershipPlanDto> Update(Guid clubId, Guid planId, UpdateClubMembershipPlanDto dto, CancellationToken ct)
        {
            if (clubId == Guid.Empty) throw new BadRequestException("clubId is empty.");
            if (planId == Guid.Empty) throw new BadRequestException("planId is empty.");

            ClubMembershipPlan existing;
            try
            {
                existing = await _repo.GetById(planId, ct);
            }
            catch
            {
                throw new NotFoundException($"ClubMembershipPlan '{planId}' not found.");
            }

            if (existing.ClubId != clubId)
                throw new NotFoundException($"ClubMembershipPlan '{planId}' not found in club '{clubId}'.");

            var name = (dto.Name ?? "").Trim();
            if (string.IsNullOrWhiteSpace(name))
                throw new BadRequestException("Name is required.");

            var exists = await _repo.NameExists(clubId, name, excludePlanId: planId, ct);
            if (exists)
                throw new BadRequestException($"Plan name '{name}' already exists for this club.");

            _mapper.Map(dto, existing);
            existing.Name = name;
            existing.UpdatedAtUtc = DateTime.UtcNow;

            await _repo.Update(existing, ct);

            return _mapper.Map<ClubMembershipPlanDto>(existing);
        }

        public async Task Delete(Guid clubId, Guid planId, CancellationToken ct)
        {
            if (clubId == Guid.Empty) throw new BadRequestException("clubId is empty.");
            if (planId == Guid.Empty) throw new BadRequestException("planId is empty.");

            ClubMembershipPlan existing;
            try
            {
                existing = await _repo.GetById(planId, ct);
            }
            catch
            {
                throw new NotFoundException($"ClubMembershipPlan '{planId}' not found.");
            }

            if (existing.ClubId != clubId)
                throw new NotFoundException($"ClubMembershipPlan '{planId}' not found in club '{clubId}'.");

            await _repo.Delete(existing, ct);
        }
    }
}
