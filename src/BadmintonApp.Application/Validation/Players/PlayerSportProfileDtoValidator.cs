using BadmintonApp.Application.DTOs.Player;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Validation.Players
{
    public class PlayerSportProfileDtoValidator
    : AbstractValidator<PlayerSportProfileDto>
    {
        public PlayerSportProfileDtoValidator()
        {
            RuleFor(x => x.Sport).IsInEnum();
            RuleFor(x => x.Level).IsInEnum();
        }
    }
}
