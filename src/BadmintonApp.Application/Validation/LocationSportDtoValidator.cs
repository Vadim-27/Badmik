using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Domain.Enums;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Validation
{
    public sealed class LocationSportDtoValidator : AbstractValidator<LocationSportDto>
    {
        public LocationSportDtoValidator()
        {
            RuleFor(x => x.SportType)
                .IsInEnum()
                .WithMessage("SportType is invalid.")
                .WithErrorCode("Sports.SportType.Invalid");

            RuleFor(x => x.CourtCount)
                .GreaterThanOrEqualTo(0)
                .WithMessage("CourtCount must be greater or equal to 0.")
                .WithErrorCode("Sports.CourtCount.Negative")
                .LessThanOrEqualTo(64)
                .WithMessage("CourtCount is too large.")
                .WithErrorCode("Sports.CourtCount.TooLarge");
        }
    }
}
