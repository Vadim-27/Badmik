using AutoMapper;
using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Trainings;
using BadmintonApp.Domain.Enums.Booking;
using BadmintonApp.Domain.Trainings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public sealed class TrainingSessionService : ITrainingSessionService
    {
        private readonly ITrainingSessionRepository _sessions;
        private readonly ITrainingBookingRepository _bookingRepo;
        private readonly IMapper _mapper;

        public TrainingSessionService(ITrainingSessionRepository sessions, ITrainingBookingRepository bookingRepo, IMapper mapper)
        {
            _sessions = sessions;
            _bookingRepo = bookingRepo;
            _mapper = mapper;
        }

        public Task<TrainingSession?> GetByIdAsync(Guid sessionId, CancellationToken ct)
            => _sessions.GetByIdAsync(sessionId, ct);

        public async Task<TrainingParticipantsDto> GetParticipantsAsync(Guid trainingSessionId, CancellationToken ct)
        {
            if (trainingSessionId == Guid.Empty) throw new BadRequestException("trainingSessionId is empty.");

            var all = await _bookingRepo.GetBySessionAsync(trainingSessionId, ct);

            // optional: exclude cancelled/declined depending on your rules
            var registered = all
                .Where(b => !b.IsWaitlist && b.AttendanceStatus != AttendanceStatus.Cancelled)
                .OrderBy(b => b.CreatedAtUtc)
                .ToList();

            var waitlist = all
                .Where(b => b.IsWaitlist && b.AttendanceStatus != AttendanceStatus.Cancelled)
                .OrderBy(b => b.CreatedAtUtc) // or WaitlistPosition if you add it later
                .ToList();

            var registeredDto = _mapper.Map<List<TrainingBooking>, List<TrainingBookingDto>>(registered);
            var waitlistDto = _mapper.Map<List<TrainingBooking>, List<TrainingBookingDto>>(waitlist);

            return new TrainingParticipantsDto(trainingSessionId, registeredDto, waitlistDto);
        }
    }
}
