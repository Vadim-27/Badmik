using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Domain.Enums.Training;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Validation;

public class CreateTrainingDtoValidator : AbstractValidator<CreateTrainingDto>
{
    private const int MaxCourtsAllowed = 20; //?
    private const int MaxPlayersAllowed = 64; //?

    public CreateTrainingDtoValidator()
    {        
        RuleFor(x => x.LocationId) // первіряти айдішник на існування за допомогою MustAsync (переробити.)
            .Must(id => id == null || id.Value != Guid.Empty)
            .WithMessage("LocationId must be either null or a valid GUID.")
            .WithErrorCode("Location.Invalid");
        
        RuleFor(x => x.Type)
            .IsInEnum()
            .WithMessage("Training type is invalid.")
            .WithErrorCode("Type.Invalid");
        
        RuleFor(x => x.Date)
            .Must(d => d.Date >= DateTime.Today)
            .WithMessage("Date must be today or in the future.")
            .WithErrorCode("Date.Past");
        
        RuleFor(x => x)
            .Must(x => x.EndTime > x.StartTime)
            .WithMessage("End time must be greater than start time.")
            .WithErrorCode("Time.Range");
        
        RuleFor(x => x.CourtsUsed) // уточнити з бызнес-логікою.
            .GreaterThan(0).WithMessage("CourtsUsed must be greater than 0.").WithErrorCode("Courts.ZeroOrNegative")
            .LessThanOrEqualTo(MaxCourtsAllowed).WithMessage($"CourtsUsed must be ≤ {MaxCourtsAllowed}.").WithErrorCode("Courts.TooMany");
        
        RuleFor(x => x.MaxPlayers)
            .GreaterThan(0).WithMessage("MaxPlayers must be greater than 0.").WithErrorCode("Players.ZeroOrNegative")
            .LessThanOrEqualTo(MaxPlayersAllowed).WithMessage($"MaxPlayers must be ≤ {MaxPlayersAllowed}.").WithErrorCode("Players.TooMany");
        
        RuleFor(x => x.AllowedLevels)
            .NotNull().WithMessage("AllowedLevels cannot be null.").WithErrorCode("Levels.Null");

        RuleFor(x => x)
            .Custom((dto, ctx) =>
            {                
                if (dto.Type == TrainingType.Individual && dto.MaxPlayers != 2)
                {
                    ctx.AddFailure(nameof(CreateTrainingDto.MaxPlayers), "Individual training must have exactly 2 players.");
                }
                                
                if (dto.Type == TrainingType.CourtRental && dto.TrainerId != null)
                {
                    ctx.AddFailure(nameof(CreateTrainingDto.TrainerId), "CourtRental must not have a trainer.");
                }
               
                if (dto.Type != TrainingType.CourtRental)
                {
                    if (dto.AllowedLevels == null || dto.AllowedLevels.Count == 0)
                    {
                        ctx.AddFailure(nameof(CreateTrainingDto.AllowedLevels), "AllowedLevels must contain at least one level.");
                    }
                }
                
                if (dto.AllowedLevels != null && dto.AllowedLevels.Count > 0)
                {
                    var distinct = dto.AllowedLevels.Distinct().Count();
                    if (distinct != dto.AllowedLevels.Count)
                    {
                        ctx.AddFailure(nameof(CreateTrainingDto.AllowedLevels), "AllowedLevels contains duplicates.");
                    }
                }
                
                //if (dto.EndTime <= dto.StartTime)
                //{
                //    ctx.AddFailure(nameof(CreateTrainingDto.EndTime), "EndTime must be later than StartTime.");
                //}
            });
    }
}
