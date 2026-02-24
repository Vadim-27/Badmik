using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Trainings
{
    public sealed class GenerateWeeklySessionsDto
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public Guid CreatedByUserId { get; set; }
    }
}
