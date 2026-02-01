using BadmintonApp.Application.DTOs.Player;
using FluentValidation;

namespace BadmintonApp.Application.Validation.Players
{
    

    public sealed class CreateMembershipDtoValidator : AbstractValidator<CreateMembershipDto>
    {
        public CreateMembershipDtoValidator()
        {
            RuleFor(x => x.ClubId)
                .NotEmpty().WithMessage("ClubId is required.").WithErrorCode("Membership.ClubId.Empty");

            RuleFor(x => x.ValidFrom)
                .NotEmpty().WithMessage("ValidFrom is required.").WithErrorCode("Membership.ValidFrom.Empty");

            RuleFor(x => x.ValidUntil)
                .GreaterThan(x => x.ValidFrom)
                .When(x => x.ValidUntil.HasValue)
                .WithMessage("ValidUntil must be greater than ValidFrom.")
                .WithErrorCode("Membership.ValidUntil.InvalidRange");

            RuleFor(x => x.TrainingType)
                .IsInEnum()
                .WithMessage("Invalid training type.")
                .WithErrorCode("Membership.TrainingType.Invalid");

            RuleFor(x => x.TrainingsTotalGranted)
                .GreaterThan(0)
                .WithMessage("TrainingsGranted must be greater than 0.")
                .WithErrorCode("Membership.TrainingsGranted.NonPositive");
        }
    }
}
