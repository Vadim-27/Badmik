using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Domain.Trainings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Trainings
{
    public interface ITrainingSessionService
    {
        Task<TrainingSession?> GetByIdAsync(Guid sessionId, CancellationToken ct);
        Task<TrainingParticipantsDto> GetParticipantsAsync(Guid sessionId, CancellationToken ct);
    }
}
