using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Auth
{
    public interface ICurrentUserContext
    {
        Guid UserId { get; }
        Guid ClubId { get; }
        bool IsAuthenticated { get; }
    }
}
