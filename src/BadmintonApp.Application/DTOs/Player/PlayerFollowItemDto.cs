using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Player
{
    public class PlayerFollowItemDto
    {
        public Guid PlayerId { get; set; }    
        public string FullName { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public Guid ClubId { get; set; }
    }
}
