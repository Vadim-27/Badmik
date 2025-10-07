using BadmintonApp.Domain.Trainings.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Players;

public interface IPlayerRepository
{
    Task Registration(Guid userId, PlayerLevel playerLevel, CancellationToken cancellationToken);
}
