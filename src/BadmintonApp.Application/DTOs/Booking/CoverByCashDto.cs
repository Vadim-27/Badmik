using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Booking
{
    public sealed class CoverByCashDto
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "UAH";
        public string? Note { get; set; }
    }
}
