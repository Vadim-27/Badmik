using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Training;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Clubs
{
    public class CreateClubMembershipPlanDto
    {
        public Guid ClubId { get; set; }

        public string Name { get; set; } = null!;
        public int DurationDays { get; set; }
        public int TrainingsGranted { get; set; }

        public SportType SportType { get; set; }
        public TrainingType TrainingType { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
