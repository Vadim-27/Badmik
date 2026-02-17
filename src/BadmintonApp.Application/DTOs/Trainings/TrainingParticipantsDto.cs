using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Trainings
{
    public sealed class TrainingParticipantsDto
    {
        public TrainingParticipantsDto(Guid trainingSessionId, List<TrainingBookingDto> registered, List<TrainingBookingDto> waitlist)
        {
            TrainingSessionId = trainingSessionId;
            Registered = registered;
            Waitlist = waitlist;
        }
        public Guid TrainingSessionId { get; set; }

        public List<TrainingBookingDto> Registered { get; set; } = new List<TrainingBookingDto>();
        public IReadOnlyList<TrainingBookingDto> Waitlist { get; set; } = new List<TrainingBookingDto>();
    }
}
