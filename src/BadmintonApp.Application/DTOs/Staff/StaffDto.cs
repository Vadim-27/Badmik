using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Staff;

public class StaffDto
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }   

    public string Email { get; set; }   
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public StaffStatus StaffStatus { get; set; }
    public StaffEmploymentType EmploymentType { get; set; }
    public Guid ClubId { get; set; }    

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public string Title { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string Notes { get; set; }

    public SalaryType SalaryType { get; set; }

    public decimal HourlyRate { get; set; }
    public decimal MonthlySalary { get; set; }
    public string Currency { get; set; }
    public string PayrollNotes { get; set; }

    public string TimeZone { get; set; }
    public string WorkingHours { get; set; }
    public string WorkingHoursExceptions { get; set; }

    public string StatusReason { get; set; }
}
