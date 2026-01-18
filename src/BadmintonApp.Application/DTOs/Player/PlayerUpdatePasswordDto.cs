using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Player
{
    public class PlayerUpdatePasswordDto
    {
        public Guid PlayerId { get; set; }
        public string Password { get; set; }
    }
}
