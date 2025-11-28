using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.Interfaces.Clubs;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public sealed class CourtsService : ICourtsService
    {
        private readonly ICourtsRepository _courtsRepository;

        public CourtsService(ICourtsRepository courtsRepository)
        {
            _courtsRepository = courtsRepository;
        }

        public async Task SyncForLocationAsync(
            Guid locationId,
            List<LocationSportDto> sportsConfig,
            CancellationToken cancellationToken = default)
        {
            var existingCourts = await _courtsRepository
                .GetByLocationIdAsync(locationId, cancellationToken);

            var courts = existingCourts.ToList();

            // SportType -> target count
            var configDict = (sportsConfig ?? new List<LocationSportDto>())
                .Where(s => s.CourtCount >= 0)
                .GroupBy(s => s.SportType)
                .ToDictionary(
                    g => g.Key,
                    g => g.Sum(x => x.CourtCount));

            var toAdd = new List<Court>();
            var toUpdate = new List<Court>();

            foreach (var kvp in configDict)
            {
                var sport = kvp.Key;
                var targetCount = kvp.Value;

                var sportCourts = courts
                    .Where(c => c.Sport == sport)
                    .OrderBy(c => c.Index)
                    .ToList();

                var activeCourts = sportCourts.Where(c => c.IsActive).ToList();
                var currentCount = activeCourts.Count;
                var diff = targetCount - currentCount;

                if (diff > 0)
                {
                    var needed = diff;

                    var inactive = sportCourts.Where(c => !c.IsActive).ToList();
                    foreach (var court in inactive.Take(needed))
                    {
                        court.IsActive = true;
                        toUpdate.Add(court);
                        needed--;
                    }

                    if (needed > 0)
                    {
                        var maxIndex = sportCourts.Any()
                            ? sportCourts.Max(c => c.Index)
                            : 0;

                        for (int i = 0; i < needed; i++)
                        {
                            var index = maxIndex + 1 + i;
                            var court = new Court
                            {
                                Id = Guid.NewGuid(),
                                LocationId = locationId,
                                Sport = sport,
                                Index = index,
                                IsActive = true,
                                Name = $"{sport}-{index}"
                            };

                            toAdd.Add(court);
                            courts.Add(court);
                        }
                    }
                }

                if (diff < 0)
                {
                    var toDeactivate = -diff;

                    foreach (var court in activeCourts
                        .OrderByDescending(c => c.Index)
                        .Take(toDeactivate))
                    {
                        court.IsActive = false;
                        toUpdate.Add(court);
                    }
                }

                var updatedSportCourts = courts
                    .Where(c => c.Sport == sport && c.IsActive)
                    .OrderBy(c => c.Index)
                    .ToList();

                foreach (var court in updatedSportCourts)
                {
                    court.Name = $"{sport}-{court.Index}";
                    toUpdate.Add(court);
                }
            }

            var configSports = new HashSet<SportType>(configDict.Keys);
            var removedSports = courts
                .Select(c => c.Sport)
                .Distinct()
                .Where(s => !configSports.Contains(s));

            foreach (var removedSport in removedSports)
            {
                foreach (var court in courts.Where(c => c.Sport == removedSport && c.IsActive))
                {
                    court.IsActive = false;
                    toUpdate.Add(court);
                }
            }

            if (toAdd.Count > 0)
                await _courtsRepository.AddRangeAsync(toAdd, cancellationToken);

            if (toUpdate.Count > 0)
                await _courtsRepository.UpdateRangeAsync(toUpdate.Distinct(), cancellationToken);
        }
    }
}
