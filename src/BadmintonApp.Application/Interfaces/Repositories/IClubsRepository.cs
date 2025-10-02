using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories
{
    public interface IClubsRepository
    {
        Task<List<Club>> GetAllAsync(string filter = null, CancellationToken cancellationToken = default);
        Task<Club> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<Club> CreateAsync(Club club, CancellationToken cancellationToken);
        Task<Club> UpdateAsync(Club club, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);        
    }
}
