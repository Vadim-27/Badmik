using System;
using System.Collections.Generic;
using BadmintonApp.Application.DTOs.Clubs;
using FluentValidation;

namespace BadmintonApp.Application.Validation.Clubs
{
    

    public class UpdateClubSettingsValidator : AbstractValidator<ClubSettingsDto>
    {
        public UpdateClubSettingsValidator()
        {
            RuleFor(x => x.ClubId)
                .NotEmpty().WithMessage("ClubId is required.");

            RuleFor(x => x.BookingOpenBeforeDays)
                .GreaterThanOrEqualTo(0).WithMessage("BookingOpenBeforeMinutes must be >= 0.");

            RuleFor(x => x.BookingOpenHour)
                .InclusiveBetween(0, 23).WithMessage("BookingOpenHour must be between 0 and 23.");

            RuleFor(x => x.UnsubscribeAllowBeforeHours)
                .GreaterThanOrEqualTo(0).WithMessage("UnsubscribeCutoffBeforeMinutes must be >= 0.");
        }
    }
}
