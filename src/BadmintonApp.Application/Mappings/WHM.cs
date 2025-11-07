using BadmintonApp.Application.DTOs.WorkingHourDtos;
using BadmintonApp.Domain.WorkingHours;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace BadmintonApp.Application.Mappings;

public static class WHM
{
    public static WorkingHour CreateWorkingHour(DayOfWeek day, TimeRangeDto time)
    {
        if (time == null) return null;

        return new WorkingHour
        {
            DayOfWeek = day,
            StartTime = TimeOnly.Parse(time.From),
            EndTime = TimeOnly.Parse(time.To)
        };


    }
    public static WorkingHourDto MapToWorkingHours(List<WorkingHour> workingHours) => new WorkingHourDto
    {
        Monday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Monday) ? new TimeRangeDto
        {
            From = workingHours.FirstOrDefault(x => x.DayOfWeek == DayOfWeek.Monday).StartTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture),
            To = workingHours.FirstOrDefault(x => x.DayOfWeek == DayOfWeek.Monday).EndTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture)
        } : null,

        Tuesday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Tuesday)
           ? new TimeRangeDto
           {
               From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Tuesday).StartTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture),
               To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Tuesday).EndTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture)
           }
           : null,

        Wednesday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Wednesday)
           ? new TimeRangeDto
           {
               From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Wednesday).StartTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture),
               To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Wednesday).EndTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture)
           }
           : null,

        Thursday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Thursday)
           ? new TimeRangeDto
           {
               From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Thursday).StartTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture),
               To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Thursday).EndTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture)
           }
           : null,

        Friday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Friday)
           ? new TimeRangeDto
           {
               From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Friday).StartTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture),
               To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Friday).EndTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture)
           }
           : null,

        Saturday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Saturday)
           ? new TimeRangeDto
           {
               From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Saturday).StartTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture),
               To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Saturday).EndTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture)
           }
           : null,

        Sunday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Sunday)
           ? new TimeRangeDto
           {
               From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Sunday).StartTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture),
               To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Sunday).EndTime?.ToString("hh\\:mm", CultureInfo.InvariantCulture)
           }
           : null,
    };


}
