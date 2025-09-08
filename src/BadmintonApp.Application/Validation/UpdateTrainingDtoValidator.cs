using BadmintonApp.Application.DTOs.Trainings;
using FluentValidation;
using System;
using System.Linq;

namespace BadmintonApp.Application.Validation;

// створити перевірку на існування по ID, потім викликати валідацію на створення. (Переробити.)

public class UpdateTrainingDtoValidator : AbstractValidator<UpdateTrainingDto>
{
    private const int MaxCourtsAllowed = 20; //?
    private const int MaxPlayersAllowed = 64; //?

    public UpdateTrainingDtoValidator()
    {        
        RuleFor(x => x.Date)
            .Must(d => d.Date >= DateTime.Today)
            .WithMessage("Date must be today or in the future.")
            .WithErrorCode("Date.Past");
        
        RuleFor(x => x)
            .Must(x => x.EndTime > x.StartTime)
            .WithMessage("End time must be greater than start time.")
            .WithErrorCode("Time.Range");
        
        RuleFor(x => x.CourtsUsed)
            .GreaterThan(0).WithMessage("CourtsUsed must be greater than 0.").WithErrorCode("Courts.ZeroOrNegative")
            .LessThanOrEqualTo(MaxCourtsAllowed).WithMessage($"CourtsUsed must be ≤ {MaxCourtsAllowed}.").WithErrorCode("Courts.TooMany");
        
        RuleFor(x => x.MaxPlayers)
            .GreaterThan(0).WithMessage("MaxPlayers must be greater than 0.").WithErrorCode("Players.ZeroOrNegative")
            .LessThanOrEqualTo(MaxPlayersAllowed).WithMessage($"MaxPlayers must be ≤ {MaxPlayersAllowed}.").WithErrorCode("Players.TooMany");
        
        RuleFor(x => x.TrainerId)
            .Must(id => id == null || id.Value != Guid.Empty)
            .WithMessage("TrainerId must be either null or a valid GUID.")
            .WithErrorCode("Trainer.Invalid");
        
        RuleFor(x => x.AllowedLevels)
            .NotNull().WithMessage("AllowedLevels cannot be null.").WithErrorCode("Levels.Null");

        RuleForEach(x => x.AllowedLevels)
            .IsInEnum().WithMessage("Allowed level is invalid.").WithErrorCode("Levels.Invalid");

        RuleFor(x => x)
            .Custom((dto, ctx) =>
            {                
                if (dto.AllowedLevels != null && dto.AllowedLevels.Count > 0)
                {
                    var distinct = dto.AllowedLevels.Distinct().Count();
                    if (distinct != dto.AllowedLevels.Count)
                        ctx.AddFailure(nameof(UpdateTrainingDto.AllowedLevels), "AllowedLevels contains duplicates.");
                }
                
                if (dto.EndTime <= dto.StartTime)
                    ctx.AddFailure(nameof(UpdateTrainingDto.EndTime), "EndTime must be later than StartTime.");
            });
    }
}
