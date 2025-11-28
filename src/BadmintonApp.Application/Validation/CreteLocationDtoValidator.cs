using BadmintonApp.Application.DTOs.Clubs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Validation
{
    public sealed class CreateLocationDtoValidator : AbstractValidator<CreateLocationDto>
    {
        public CreateLocationDtoValidator()
        {
            // ClubId
            RuleFor(x => x.ClubId)
                .NotEmpty()
                .WithMessage("ClubId is required.")
                .WithErrorCode("ClubId.Empty");

            // Name
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Name is required.").WithErrorCode("Name.Empty")
                .MinimumLength(2).WithMessage("Name is too short.").WithErrorCode("Name.TooShort")
                .MaximumLength(100).WithMessage("Name is too long.").WithErrorCode("Name.TooLong")
                .Matches(@"^[\p{L}\p{M}\p{N}\-'\.,\s]+$")
                    .WithMessage("Name contains invalid characters.")
                    .WithErrorCode("Name.InvalidChars");

            // City (як ти вже робив)
            RuleFor(x => x.City)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("City is required.").WithErrorCode("City.Empty")
                .MinimumLength(2).WithMessage("City is too short.").WithErrorCode("City.TooShort")
                .MaximumLength(100).WithMessage("City is too long.").WithErrorCode("City.TooLong")
                .Matches(@"^[\p{L}\p{M}\p{N}\-'\.,\s]+$")
                    .WithMessage("City contains invalid characters.")
                    .WithErrorCode("City.InvalidChars");

            // Address
            RuleFor(x => x.Address)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Address is required.").WithErrorCode("Address.Empty")
                .MinimumLength(3).WithMessage("Address is too short.").WithErrorCode("Address.TooShort")
                .MaximumLength(200).WithMessage("Address is too long.").WithErrorCode("Address.TooLong");

            // Order
            RuleFor(x => x.Order)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Order must be greater or equal to 0.")
                .WithErrorCode("Order.Negative");

            // PriceText / Description
            RuleFor(x => x.PriceText)
                .MaximumLength(100)
                .WithMessage("PriceText is too long.")
                .WithErrorCode("PriceText.TooLong");

            RuleFor(x => x.Description)
                .MaximumLength(1000)
                .WithMessage("Description is too long.")
                .WithErrorCode("Description.TooLong");

            // SPORTS ------------------------

            RuleFor(x => x.Sports)
                .NotNull()
                .WithMessage("Sports collection must be provided (can be empty).")
                .WithErrorCode("Sports.Null");

            RuleForEach(x => x.Sports)
                .SetValidator(new LocationSportDtoValidator());

            // заборона дублікатів по SportType
            RuleFor(x => x.Sports)
                .Must(sports =>
                {
                    if (sports == null || sports.Count == 0) return true;
                    var distinctCount = sports
                        .Select(s => s.SportType)
                        .Distinct()
                        .Count();
                    return distinctCount == sports.Count;
                })
                .When(x => x.Sports != null && x.Sports.Count > 0)
                .WithMessage("Sports cannot contain duplicate sport types.")
                .WithErrorCode("Sports.Duplicates");

            // WORKING HOURS -----------------

            RuleFor(x => x.WorkingHours)
                .NotNull()
                .WithMessage("WorkingHours collection must be provided (can be empty).")
                .WithErrorCode("WorkingHours.Null");

            // кожен елемент (ти можеш мати 0 або більше профілів розкладу)
            RuleForEach(x => x.WorkingHours)
                .SetValidator(new WorkingHourDtoValidator());

            // Якщо хочеш, можеш додати правило "принаймні один розклад":
            // RuleFor(x => x.WorkingHours)
            //     .Must(list => list != null && list.Count > 0)
            //     .WithMessage("At least one working hours profile must be provided.")
            //     .WithErrorCode("WorkingHours.Empty");
        }
    }
}
