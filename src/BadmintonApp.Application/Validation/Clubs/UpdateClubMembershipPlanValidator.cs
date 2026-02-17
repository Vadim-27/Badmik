using BadmintonApp.Application.DTOs.Clubs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Validation.Clubs
{
    public class UpdateClubMembershipPlanValidator : AbstractValidator<UpdateClubMembershipPlanDto>
    {
        public UpdateClubMembershipPlanValidator()
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Name is required.").WithErrorCode("Name.Empty")
                .MaximumLength(128).WithMessage("Name is too long.").WithErrorCode("Name.TooLong");

            RuleFor(x => x.DurationDays)
                .GreaterThan(0).WithMessage("DurationDays must be > 0.").WithErrorCode("DurationDays.Invalid");

            RuleFor(x => x.TrainingsGranted)
                .GreaterThan(0).WithMessage("TrainingsGranted must be > 0.").WithErrorCode("TrainingsGranted.Invalid");

            RuleFor(x => x.SportType)
                .IsInEnum().WithMessage("SportType is invalid.").WithErrorCode("SportType.Invalid");

            RuleFor(x => x.TrainingType)
                .IsInEnum().WithMessage("TrainingType is invalid.").WithErrorCode("TrainingType.Invalid");
        }
    }
}
