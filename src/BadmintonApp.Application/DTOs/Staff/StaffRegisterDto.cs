using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
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
    public Guid ClubId { get; set; }   

    public DateTime DoB { get; set; }
    public decimal Salary { get; set; }
    public List<WorkingHourDto> WorkingHours { get; set; } = new();
}
