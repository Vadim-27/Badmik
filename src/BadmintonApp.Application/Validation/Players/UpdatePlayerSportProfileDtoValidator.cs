using BadmintonApp.Application.DTOs.Player;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Validation.Players
{
    public class UpdatePlayerSportProfilesDtoValidator
    : AbstractValidator<UpdatePlayerSportProfilesDto>
    {
        public UpdatePlayerSportProfilesDtoValidator()
        {
            RuleFor(x => x.SportProfiles)
                .NotNull()
                .Must(list => list.Count <= 10)
                .WithMessage("Too many sport profiles (max 10).");

            RuleForEach(x => x.SportProfiles)
                .SetValidator(new PlayerSportProfileDtoValidator());

            RuleFor(x => x.SportProfiles)
                .Must(list => list.Select(i => i.Sport).Distinct().Count() == list.Count)
                .WithMessage("Duplicate sports are not allowed.");
        }
    }
}
