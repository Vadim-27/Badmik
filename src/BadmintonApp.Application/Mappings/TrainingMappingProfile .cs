using AutoMapper;
using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Domain.Trainings;

namespace BadmintonApp.Application.Mappings;

public class TrainingMappingProfile : Profile
{
    public TrainingMappingProfile()
    {
        CreateMap<CreateTrainingDto, Training>();
        CreateMap<UpdateTrainingDto, Training>();
        CreateMap<Training, TrainingResultDto>()
            .ForMember(dest => dest.CurrentPlayers, opt => opt.MapFrom(src => src.Participants.Count))
            .ForMember(dest => dest.QueueLength, opt => opt.MapFrom(src => src.Queue.Count));
    }
}
