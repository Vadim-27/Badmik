using AutoMapper;
using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Application.DTOs.Users;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Enums.Player;
using BadmintonApp.Domain.Players;
using System;

namespace BadmintonApp.Application.Mappings;

public class PlayerMappingProfile : Profile
{
    public PlayerMappingProfile()
    {
        //CreateMap<UpdatePlayerDto, Player>();
        //CreateMap<PlayerDto, Player>();

        CreateMap<User, UserResultDto>();

        CreateMap<PlayerSportProfile, PlayerSportProfileDto>();

        CreateMap<Player, PlayerDto>()
            .ForMember(d => d.User, opt => opt.MapFrom(s => s.User))
            .ForMember(d => d.SportProfiles, opt => opt.MapFrom(s => s.SportProfiles))
            .ForMember(d => d.PhotoUrl, opt => opt.Ignore());

        CreateMap<Player, PlayerFollowItemDto>()
            .ForMember(d => d.PlayerId, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.ClubId, opt => opt.MapFrom(s => s.ClubId))
            .ForMember(d => d.FullName, opt => opt.MapFrom(s =>
                (s.User.FirstName + " " + s.User.LastName).Trim()))
            .ForMember(d => d.ImageUrl, opt => opt.Ignore());

        CreateMap<PlayerClubMembership, MembershipDto>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.ClubId, opt => opt.MapFrom(s => s.ClubId))
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status))
            .ForMember(d => d.ValidFrom, opt => opt.MapFrom(s => s.ValidFrom))
            .ForMember(d => d.ValidUntil, opt => opt.MapFrom(s => s.ValidUntil))
            .ForMember(d => d.TrainingsLeft, opt => opt.MapFrom(s => s.TrainingsLeft))
            .ForMember(d => d.TrainingsTotalGranted, opt => opt.MapFrom(s => s.TrainingsTotalGranted))
            .ForMember(d => d.TrainingType, opt => opt.MapFrom(s => s.TrainingType));

        CreateMap<CreateMembershipDto, PlayerClubMembership>()
            .ForMember(d => d.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
            .ForMember(d => d.PlayerId, opt => opt.Ignore()) // задається в сервісі
            .ForMember(d => d.ClubId, opt => opt.MapFrom(s => s.ClubId))
            .ForMember(d => d.Status, opt => opt.MapFrom(_ => MembershipStatus.Active))
            .ForMember(d => d.ValidFrom, opt => opt.MapFrom(s => s.ValidFrom))
            .ForMember(d => d.ValidUntil, opt => opt.MapFrom(s => s.ValidUntil))
            .ForMember(d => d.TrainingsLeft, opt => opt.MapFrom(s => s.TrainingsTotalGranted))
            .ForMember(d => d.TrainingsTotalGranted, opt => opt.MapFrom(s => s.TrainingsTotalGranted))
            .ForMember(d => d.TrainingType, opt => opt.MapFrom(s => s.TrainingType));


        CreateMap<UpdateMembershipDto, PlayerClubMembership>()
            .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.PlayerId, opt => opt.Ignore())
            .ForMember(d => d.ClubId, opt => opt.Ignore())
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status))
            .ForMember(d => d.ValidFrom, opt => opt.MapFrom(s => s.ValidFrom))
            .ForMember(d => d.ValidUntil, opt => opt.MapFrom(s => s.ValidUntil))
            .ForMember(d => d.TrainingsLeft, opt => opt.MapFrom(s => s.TrainingsLeft))
            .ForMember(d => d.TrainingsTotalGranted, opt => opt.MapFrom(s => s.TrainingsTotalGranted));
    }
}
