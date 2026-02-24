using BadmintonApp.Application.DTOs.Users;
using BadmintonApp.Application.Interfaces.Repositories;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Validation.Users
{
    public abstract class UserBaseValidator<T> : AbstractValidator<T>
    where T : IUserLikeDto
    {
        protected UserBaseValidator(IUserRepository userRepository)
        {
            RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Email is required.").WithErrorCode("Email.Empty")
                .MinimumLength(5).WithMessage("Email is too short.").WithErrorCode("Email.TooShort")
                .MaximumLength(254).WithMessage("Email is too long.").WithErrorCode("Email.TooLong")
                .EmailAddress().WithMessage("Email format is invalid.").WithErrorCode("Email.InvalidFormat")
                .MustAsync(async (email, ct) =>
                {
                    var existing = await userRepository.GetByEmailAsync(email, ct);
                    return existing == null;
                }).WithMessage("Email is already in use.").WithErrorCode("Email.NotUnique");

            RuleFor(x => x.FirstName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("First name is required.").WithErrorCode("FirstName.Empty")
                .MinimumLength(2).WithMessage("First name is too short.").WithErrorCode("FirstName.TooShort")
                .MaximumLength(60).WithMessage("First name is too long").WithErrorCode("FirstName.TooLong")
                .Must(p => p.All(char.IsLetter));// !!!!

            RuleFor(x => x.LastName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Last name is required.").WithErrorCode("LastName.Empty")
                .MinimumLength(2).WithMessage("Last name is too short.").WithErrorCode("LastName.TooShort")
                .MaximumLength(50).WithMessage("Last name is too long.").WithErrorCode("LastName.TooLong")
                .Must(p => p.All(char.IsLetter));

            RuleFor(x => x.DoB)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Date of birth is required.").WithErrorCode("DoB.Empty")
                .LessThanOrEqualTo(DateTime.Today.AddYears(-8))
                    .WithMessage("You must be at least 8 years old.")
                    .WithErrorCode("DoB.TooYoung");
        }
    }
}
