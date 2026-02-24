using BadmintonApp.Application.DTOs.Player;
using FluentValidation;


namespace BadmintonApp.Application.Validation.Players
{
    public sealed class UpdateMembershipDtoValidator : AbstractValidator<UpdateMembershipDto>
    {
        public UpdateMembershipDtoValidator()
        {
            RuleFor(x => x.Status)
                .IsInEnum()
                .WithMessage("Invalid membership status.")
                .WithErrorCode("Membership.Status.Invalid");

           RuleFor(x => x.ValidFrom)
                .NotEmpty()
                .WithMessage("ValidFrom is required.")
                .WithErrorCode("Membership.ValidFrom.Empty");

            RuleFor(x => x.ValidUntil)
                .GreaterThan(x => x.ValidFrom)
                .When(x => x.ValidUntil.HasValue)
                .WithMessage("ValidUntil must be greater than ValidFrom.")
                .WithErrorCode("Membership.ValidUntil.InvalidRange");

            RuleFor(x => x.TrainingsLeft)
                .GreaterThanOrEqualTo(0)
                .WithMessage("TrainingsLeft cannot be negative.")
                .WithErrorCode("Membership.TrainingsLeft.Negative");

            RuleFor(x => x.TrainingsTotalGranted)
                .GreaterThanOrEqualTo(0)
                .WithMessage("TrainingsTotalGranted cannot be negative.")
                .WithErrorCode("Membership.TrainingsTotalGranted.Negative");

            RuleFor(x => x)
                .Must(x => x.TrainingsLeft <= x.TrainingsTotalGranted)
                .WithMessage("TrainingsLeft cannot exceed TrainingsTotalGranted.")
                .WithErrorCode("Membership.TrainingsLeft.ExceedsTotal");
        }
    }
}
