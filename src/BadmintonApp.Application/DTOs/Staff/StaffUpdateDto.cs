using BadmintonApp.Domain.Enums;
using System;

namespace BadmintonApp.Application.DTOs.Staff;

public class StaffUpdateDto
{
    public Guid Id { get; set; }
    public string Email { get; set; }    
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Guid ClubId { get; set; }

    public DateTime DoB { get; set; }


    public StaffStatus StaffStatus { get; set; }
    public StaffEmploymentType EmploymentType { get; set; }

    public string Title { get; set; }
    public DateOnly StartDate { get; set; }
    public string Notes { get; set; }
    public SalaryType SalaryType { get; set; }
    public decimal HourlyRate { get; set; }
    public decimal MonthlySalary { get; set; }
    public string Currency { get; set; }
    public string PayrollNotes { get; set; }
    public string TimeZone { get; set; }
    public string WorkingHours { get; set; }
    public string WorkingHoursExceptions { get; set; }
}
