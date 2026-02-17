using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Enums.Payment
{
    public enum PaymentStatus
    {
        Created = 1,
        Pending = 2,
        Paid = 3,
        Failed = 4,
        Cancelled = 5,
        Refunded = 6
    }
}
