using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.Interfaces.Repositories;
using FluentValidation;
using System;
using System.Linq;
namespace BadmintonApp.Application.Validation;

public class UserRegistrationValidation : AbstractValidator<PlayerRegisterDto>
{


    public UserRegistrationValidation(IUserRepository userRepository)
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

        RuleFor(x => x.Password)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Password is required.").WithErrorCode("Pssword.Empty")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters.").WithErrorCode("Password.TooShort")
            .MaximumLength(64).WithMessage("Password must be at most 64 characters.").WithErrorCode("Password.TooLong")
            .Must(p => p.All(c => !char.IsWhiteSpace(c))).WithMessage("Password cannot cotain whitespace.").WithErrorCode("Password.Whitespace")
            .Must(p => p.Any(char.IsDigit)).WithMessage("Password must contain at least one digit.").WithErrorCode("Password.NoDigit")
            .Must(p => p.Any(char.IsUpper)).WithMessage("Password must contain at least one uppercase letter.").WithErrorCode("Password.NoUpper")
            .Must(p => p.Any(char.IsLower)).WithMessage("Password must contain at least one lowercase letter.").WithErrorCode("Password.MoLower")
            .Must(p => p.Any(c => "!@#$%^&*()_+-=[]{}|;':\",.<>?/`~".Contains(c))).WithMessage("Password must contain at least one special character").WithErrorCode("Password.NoSpecial");

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
