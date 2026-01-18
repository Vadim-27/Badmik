using BadmintonApp.Application.DTOs.Player;
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
    public class CreateUserDtoValidator : UserBaseValidator<CreateUserDto>
    {
        public CreateUserDtoValidator(IUserRepository userRepository):base(userRepository)
        {
            RuleFor(x => x.Password)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Password is required.").WithErrorCode("Password.Empty")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters.").WithErrorCode("Password.TooShort")
                .MaximumLength(64).WithMessage("Password must be at most 64 characters.").WithErrorCode("Password.TooLong")
                .Must(p => p.All(c => !char.IsWhiteSpace(c))).WithMessage("Password cannot cotain whitespace.").WithErrorCode("Password.Whitespace")
                .Must(p => p.Any(char.IsDigit)).WithMessage("Password must contain at least one digit.").WithErrorCode("Password.NoDigit")
                .Must(p => p.Any(char.IsUpper)).WithMessage("Password must contain at least one uppercase letter.").WithErrorCode("Password.NoUpper")
                .Must(p => p.Any(char.IsLower)).WithMessage("Password must contain at least one lowercase letter.").WithErrorCode("Password.MoLower")
                .Must(p => p.Any(c => "!@#$%^&*()_+-=[]{}|;':\",.<>?/`~".Contains(c))).WithMessage("Password must contain at least one special character").WithErrorCode("Password.NoSpecial");
        }
    }
}
