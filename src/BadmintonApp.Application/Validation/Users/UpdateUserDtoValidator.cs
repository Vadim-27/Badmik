using BadmintonApp.Application.DTOs.Users;
using BadmintonApp.Application.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Validation.Users
{
    public class UpdateUserDtoValidator : UserBaseValidator<UpdateUserDto>
    {
        public UpdateUserDtoValidator(IUserRepository userRepository) : base(userRepository)
        {
        }
    }
}
