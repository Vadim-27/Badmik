using BadmintonApp.Application.DTOs.Clubs;
using FluentValidation;

namespace BadmintonApp.Application.Validation;

public sealed class UpdateClubDtoValidator : AbstractValidator<UpdateClubDto>
{
    private const int MaxCourtsAllowed = 100;

    public UpdateClubDtoValidator()
    {       
        
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Name is required.").WithErrorCode("Name.Empty")
            .MinimumLength(2).WithMessage("Name is too short.").WithErrorCode("Name.TooShort")
            .MaximumLength(100).WithMessage("Name is too long.").WithErrorCode("Name.TooLong");
        
        RuleFor(x => x.City)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("City is required.").WithErrorCode("City.Empty")
            .MinimumLength(2).WithMessage("City is too short.").WithErrorCode("City.TooShort")
            .MaximumLength(100).WithMessage("City is too long.").WithErrorCode("City.TooLong")
            .Matches(@"^[\p{L}\p{M}\p{N}\-'\.,\s]+$")
                .WithMessage("City contains invalid characters.")
                .WithErrorCode("City.InvalidChars");
        
        RuleFor(x => x.Address)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Address is required.").WithErrorCode("Address.Empty")
            .MinimumLength(3).WithMessage("Address is too short.").WithErrorCode("Address.TooShort")
            .MaximumLength(200).WithMessage("Address is too long.").WithErrorCode("Address.TooLong");
        
        RuleFor(x => x.TotalCourts)
            .GreaterThan(0).WithMessage("TotalCourts must be greater than 0.").WithErrorCode("TotalCourts.ZeroOrNegative")
            .LessThanOrEqualTo(MaxCourtsAllowed).WithMessage($"TotalCourts must be ≤ {MaxCourtsAllowed}.").WithErrorCode("TotalCourts.TooMany");
        
        RuleFor(x => x.WorkingHours)
            .NotNull().WithMessage("WorkingHours is required.").WithErrorCode("WorkingHours.Empty")
            .SetValidator(new WorkingHourDtoValidator());
    }
}
