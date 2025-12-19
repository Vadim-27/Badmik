using AutoMapper;
using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.WorkingHours;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BadmintonApp.Application.Mappings;

public class StaffMappingProfile : Profile
{
    public StaffMappingProfile()
    {
        CreateMap<StaffUpdateDto, Staff>().ForMember(dest => dest.WorkingHours, s => s.MapFrom(x => new List<WorkingHour>
                {
                    WHM.CreateWorkingHour(DayOfWeek.Monday, x.WorkingHours.Monday),
                    WHM.CreateWorkingHour(DayOfWeek.Tuesday, x.WorkingHours.Tuesday),
                    WHM.CreateWorkingHour(DayOfWeek.Wednesday, x.WorkingHours.Wednesday),
                    WHM.CreateWorkingHour(DayOfWeek.Thursday, x.WorkingHours.Thursday),
                    WHM.CreateWorkingHour(DayOfWeek.Friday, x.WorkingHours.Friday),
                    WHM.CreateWorkingHour(DayOfWeek.Saturday, x.WorkingHours.Saturday),
                    WHM.CreateWorkingHour(DayOfWeek.Sunday, x.WorkingHours.Sunday),
                }.Where(x => x != null).ToList()));

        CreateMap<Staff, StaffDto>()
            .ForMember(dest => dest.FirstName, s => s.MapFrom(x => x.User.FirstName))
            .ForMember(dest => dest.LastName, s => s.MapFrom(x => x.User.LastName))
            .ForMember(dest => dest.PhoneNumber, s => s.MapFrom(x => x.User.PhoneNumber)) //
            .ForMember(dest => dest.ImageUrl, s => s.MapFrom(x => x.User.ImageUrl))
            .ForMember(dest => dest.Email, s => s.MapFrom(x => x.User.Email))
            .ForMember(dest => dest.WorkingHours, s => s.MapFrom(x => WHM.MapToWorkingHours(x.WorkingHours)));

        CreateMap<StaffDto, Staff>();
        CreateMap<StaffRegisterDto, Staff>()
            .ForMember(dest => dest.WorkingHours, s => s.MapFrom(x => new List<WorkingHour>
                {
                    WHM.CreateWorkingHour(DayOfWeek.Monday, x.WorkingHours.Monday),
                    WHM.CreateWorkingHour(DayOfWeek.Tuesday, x.WorkingHours.Tuesday),
                    WHM.CreateWorkingHour(DayOfWeek.Wednesday, x.WorkingHours.Wednesday),
                    WHM.CreateWorkingHour(DayOfWeek.Thursday, x.WorkingHours.Thursday),
                    WHM.CreateWorkingHour(DayOfWeek.Friday, x.WorkingHours.Friday),
                    WHM.CreateWorkingHour(DayOfWeek.Saturday, x.WorkingHours.Saturday),
                    WHM.CreateWorkingHour(DayOfWeek.Sunday, x.WorkingHours.Sunday),
                }.Where(x => x != null).ToList()));

    }
}
