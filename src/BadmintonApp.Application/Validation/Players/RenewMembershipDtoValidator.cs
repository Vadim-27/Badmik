using BadmintonApp.Application.DTOs.Player;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Validation.Players
{
    public class RenewMembershipDtoValidator : AbstractValidator<RenewMembershipDto>
    {
        public RenewMembershipDtoValidator()
        {
            RuleFor(x => x.ClubId)
                .NotEmpty()
                .WithMessage("ClubId is required.")
                .WithErrorCode("ClubId.Empty");

            RuleFor(x => x.PlanId)
                .NotEmpty()
                .WithMessage("PlanId is required.")
                .WithErrorCode("PlanId.Empty");
        }
    }
}
