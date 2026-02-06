using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.Interfaces.Clubs;
using BadmintonApp.Application.Interfaces.Permissions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Enums.Permission;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public sealed class ClubSettingsService : IClubSettingsService
    {
        private readonly IClubSettingsRepository _repo;
        private readonly ICurrentUserContext _current;
        private readonly IPermissionService _permissionService;

        public ClubSettingsService(
            IClubSettingsRepository repo,
            ICurrentUserContext current,
            IPermissionService permissionService)
        {
            _repo = repo;
            _current = current;
            _permissionService = permissionService;
        }

        public async Task<ClubSettingsDto> GetAsync(Guid clubId, CancellationToken ct)
        {
            await EnsureCanManageSettings(clubId, ct);

            var s = await _repo.GetOrCreateAsync(clubId, ct);

            return new ClubSettingsDto
            {
                ClubId = s.ClubId,
                BookingOpenBeforeDays = (int)s.BookingOpenBeforeDays.TotalDays,
                UnsubscribeAllowBeforeHours = (int)s.UnsubscribeAllowBeforeHours.TotalHours,
                BookingOpenHour = (int)s.BookingOpenHour.TotalHours
            };
        }

        public async Task<ClubSettingsDto> UpdateAsync(Guid clubId, ClubSettingsDto dto, CancellationToken ct)
        {
            await EnsureCanManageSettings(clubId, ct);

            if (dto.ClubId != Guid.Empty && dto.ClubId != clubId)
                throw new BadRequestException("ClubId mismatch.");

            var s = await _repo.GetOrCreateAsync(clubId, ct);

            s.BookingOpenBeforeDays = TimeSpan.FromDays(dto.BookingOpenBeforeDays);
            s.UnsubscribeAllowBeforeHours = TimeSpan.FromHours(dto.UnsubscribeAllowBeforeHours);
            s.BookingOpenHour = TimeSpan.FromHours(dto.BookingOpenHour);
            s.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(s, ct);

            return await GetAsync(clubId, ct);
        }

        private async Task EnsureCanManageSettings(Guid clubId, CancellationToken ct)
        {
            var actorUserId = _current.UserId;

            var allowed = await _permissionService.HasPermission(
                actorUserId, clubId, PermissionType.ClubSettingsManage, ct);

            if (!allowed)
                throw new ForbiddenException("Missing permission to manage club settings.");
        }
    }
}
