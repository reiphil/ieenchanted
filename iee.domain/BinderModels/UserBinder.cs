using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iee.domain.BinderModels
{
    public class UserBinder
    {
        public string userName { get; set; }
        public string passHash { get; set; }

        public UserBinder()
        {
            userName = string.Empty;
            passHash = string.Empty;
        }
    }
}
