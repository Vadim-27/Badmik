using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Enums.Player
{
    public enum MembershipTransactionType
    {
        Grant = 1,     // нарахували (купив абонемент, бонус)
        Spend = 2,     // списали за тренування
        Refund = 3,    // повернули (відміна)
        Adjust = 4,    // ручна корекція адміном (+/-)
        Expire = 5     // згоріло (якщо буде)
    }
}
