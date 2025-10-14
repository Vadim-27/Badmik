using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Trainings.Enums;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Staff;

public class StaffRegisterDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ImageUrl { get; set; }
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
    public decimal PerTrainingRate { get; set; }
    public string PayrollNotes { get; set; }
    public string TimeZone { get; set; }
    public string WorkingHours { get; set; }
    public string WorkingHoursExceptions { get; set; }
    
    //public decimal Salary { get; set; }
    //public List<WorkingHourDto> WorkingHours { get; set; } = new();
}
