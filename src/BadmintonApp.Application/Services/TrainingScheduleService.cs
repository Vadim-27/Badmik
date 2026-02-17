using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Trainings;
using BadmintonApp.Application.Interfaces.Transactions;
using BadmintonApp.Domain.Trainings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public sealed class TrainingScheduleService : ITrainingScheduleService
    {
        private readonly ITransactionService _tx;
        private readonly ITrainingScheduleRepository _schedules;
        private readonly ITrainingSessionRepository _sessions;

        public TrainingScheduleService(ITransactionService tx, ITrainingScheduleRepository schedules, ITrainingSessionRepository sessions)
        {
            _tx = tx;
            _schedules = schedules;
            _sessions = sessions;
        }

        public async Task<Guid> CreateAsync(CreateOrUpdateScheduleDto dto, Guid createdByUserId, CancellationToken ct)
        {
            await _tx.Begin(ct);
            try
            {
                var schedule = new TrainingSchedule
                {
                    Id = Guid.NewGuid(),
                    ClubId = dto.ClubId,
                    LocationId = dto.LocationId,
                    IsActive = dto.IsActive,
                    DayOfWeek = dto.DayOfWeek,
                    StartTime = dto.StartTime,
                    EndTime = dto.EndTime,
                    Sport = dto.Sport,
                    Type = dto.Type,
                    CourtsRequired = dto.CourtsRequired,
                    MaxParticipants = dto.MaxParticipants,
                    CreatedAtUtc = DateTime.UtcNow,
                    UpdatedAtUtc = DateTime.UtcNow,
                    Levels = dto.Levels.Select(l => new TrainingScheduleLevel { /* map */ }).ToList()
                };

                await _schedules.CreateAsync(schedule, ct);
                await _tx.Commit(ct);
                return schedule.Id;
            }
            catch
            {
                await _tx.RollBack(ct);
                throw;
            }
        }

        public async Task UpdateAsync(Guid scheduleId, CreateOrUpdateScheduleDto dto, Guid updatedByUserId, CancellationToken ct)
        {
            await _tx.Begin(ct);
            try
            {
                var schedule = await _schedules.GetByIdAsync(scheduleId, ct) ?? throw new KeyNotFoundException("Schedule not found.");

                schedule.LocationId = dto.LocationId;
                schedule.IsActive = dto.IsActive;
                schedule.DayOfWeek = dto.DayOfWeek;
                schedule.StartTime = dto.StartTime;
                schedule.EndTime = dto.EndTime;
                schedule.Sport = dto.Sport;
                schedule.Type = dto.Type;
                schedule.CourtsRequired = dto.CourtsRequired;
                schedule.MaxParticipants = dto.MaxParticipants;
                schedule.UpdatedAtUtc = DateTime.UtcNow;

                // levels update: simplest replace for MVP
                schedule.Levels = dto.Levels.Select(l => new TrainingScheduleLevel { /* map */ }).ToList();

                await _schedules.UpdateAsync(schedule, ct);
                await _tx.Commit(ct);
            }
            catch
            {
                await _tx.RollBack(ct);
                throw;
            }
        }

        public async Task DeactivateAsync(Guid scheduleId, Guid updatedByUserId, CancellationToken ct)
        {
            await _tx.Begin(ct);
            try
            {
                var schedule = await _schedules.GetByIdAsync(scheduleId, ct) ?? throw new KeyNotFoundException("Schedule not found.");
                schedule.IsActive = false;
                schedule.UpdatedAtUtc = DateTime.UtcNow;

                await _schedules.UpdateAsync(schedule, ct);
                await _tx.Commit(ct);
            }
            catch
            {
                await _tx.RollBack(ct);
                throw;
            }
        }

        public async Task<Guid> CreateSessionFromScheduleAsync(CreateSessionFromScheduleDto dto, Guid createdByUserId, CancellationToken ct)
        {
            await _tx.Begin(ct);
            try
            {
                var schedule = await _schedules.GetByIdAsync(dto.ScheduleId, ct) ?? throw new KeyNotFoundException("Schedule not found.");

                if (await _sessions.ExistsAsync(schedule.Id, dto.Date.Date, ct))
                    throw new InvalidOperationException("Session already exists for schedule on this date.");

                var session = new TrainingSession
                {
                    Id = Guid.NewGuid(),
                    ClubId = schedule.ClubId,
                    LocationId = schedule.LocationId,
                    Type = schedule.Type,
                    Date = dto.Date.Date,
                    StartTime = schedule.StartTime,
                    EndTime = schedule.EndTime,
                    IsRecurringWeekly = true,
                    CourtsUsed = dto.OverrideCourtsUsed ?? schedule.CourtsRequired,
                    MaxPlayers = dto.OverrideMaxPlayers ?? schedule.MaxParticipants,
                    TrainerId = dto.TrainerId,
                    Levels = schedule.Levels.Select(l => new TrainingSessionLevel { /* map */ }).ToList()
                };

                // strongly recommended: store SportType in session too (add field)
                // session.Sport = schedule.Sport;

                await _sessions.CreateAsync(session, ct);
                await _tx.Commit(ct);
                return session.Id;
            }
            catch
            {
                await _tx.RollBack(ct);
                throw;
            }
        }

        public async Task<int> GenerateWeeklySessionsAsync(Guid clubId, DateTime fromDate, DateTime toDate, Guid createdByUserId, CancellationToken ct)
        {
            if (fromDate.Date > toDate.Date) throw new InvalidOperationException("fromDate > toDate");

            await _tx.Begin(ct);
            try
            {
                var schedules = await _schedules.GetActiveByClubAsync(clubId, ct);
                int created = 0;

                for (var day = fromDate.Date; day <= toDate.Date; day = day.AddDays(1))
                {
                    var dow = day.DayOfWeek;
                    foreach (var sch in schedules.Where(s => s.DayOfWeek == dow))
                    {
                        if (await _sessions.ExistsAsync(sch.Id, day, ct))
                            continue;

                        var session = new TrainingSession
                        {
                            Id = Guid.NewGuid(),
                            ClubId = sch.ClubId,
                            LocationId = sch.LocationId,
                            Type = sch.Type,
                            Date = day,
                            StartTime = sch.StartTime,
                            EndTime = sch.EndTime,
                            IsRecurringWeekly = true,
                            CourtsUsed = sch.CourtsRequired,
                            MaxPlayers = sch.MaxParticipants,
                            TrainerId = null,
                            Levels = sch.Levels.Select(l => new TrainingSessionLevel { /* map */ }).ToList()
                            // session.Sport = sch.Sport; // recommended if you add it
                        };

                        await _sessions.CreateAsync(session, ct);
                        created++;
                    }
                }

                await _tx.Commit(ct);
                return created;
            }
            catch
            {
                await _tx.RollBack(ct);
                throw;
            }
        }
    }
}
