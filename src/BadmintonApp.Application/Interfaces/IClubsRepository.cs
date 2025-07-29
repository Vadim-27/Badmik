using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces
{
    public interface IClubsRepository
    {
        Task<List<Club>> GetAllAsync(string? filter = null);
        Task<Club?> GetByIdAsync(Guid id);
        Task<Club> CreateAsync(Club club);
        Task<Club> UpdateAsync(Club club);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> AssignAdminAsync(Guid clubId, Guid userId);
    }
}
