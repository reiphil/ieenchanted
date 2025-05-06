using iee.domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iee.domain.BinderModels
{
    public class FullStoreModel
    {
        public Store storeInfo { get; set; }

        public List<string> URLS { get; set; }
        public List<EventInfoBinder> WeeklyEvents { get; set; }
        public List<EventInfoBinder> UpcomingEvents { get; set; }

        public FullStoreModel() {
            storeInfo = new Store();
            URLS = new List<string>();
            WeeklyEvents = new List<EventInfoBinder>();
            UpcomingEvents = new List<EventInfoBinder>();
        }

        public FullStoreModel(Store s, List<string> sUrls) {
            storeInfo = s;
            URLS = sUrls;
            WeeklyEvents = new List<EventInfoBinder>();
            UpcomingEvents = new List<EventInfoBinder>();
        }


    }
}
