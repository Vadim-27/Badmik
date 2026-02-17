using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.Interfaces.Repositories;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Validation.Clubs
{
    public class CreateClubMembershipPlanValidator : AbstractValidator<CreateClubMembershipPlanDto>
    {
        public CreateClubMembershipPlanValidator(IClubMembershipPlanRepository repo)
        {
            RuleFor(x => x.ClubId)
                .NotEmpty().WithMessage("ClubId is required.").WithErrorCode("ClubId.Empty");

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

            RuleFor(x => x.IsActive)
                .NotNull(); // bool anyway, keeps symmetry

            RuleFor(x => x)
                .MustAsync(async (dto, ct) =>
                {
                    var name = dto.Name?.Trim() ?? "";
                    if (dto.ClubId == Guid.Empty || string.IsNullOrWhiteSpace(name))
                        return true;

                    var exists = await repo.NameExists(dto.ClubId, name, excludePlanId: null, ct);
                    return !exists;
                })
                .WithMessage("Plan name already exists for this club.")
                .WithErrorCode("Name.NotUnique");
        }
    }
}
