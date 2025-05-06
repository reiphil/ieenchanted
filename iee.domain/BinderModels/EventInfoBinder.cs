using iee.domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace iee.domain.BinderModels
{
    public class EventInfoBinder
    {
        public int eventId { get; set; }
        public int storeId { get; set; }
        public string eventType { get; set; }
        public int dayOfWeek { get; set; }
        public int timeOfEvent { get; set; }
        public string dateOfEvent { get; set; }
        public string meleeUrl { get; set; }
        public string signUpUrl { get; set; }
        public string cost { get; set; }
        public string notes { get; set; }
        public string title { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Store? storeInfo { get; set; } = new Store();

        public EventInfoBinder()
        {
            eventId = 0;
            storeId = 0;
            eventType = string.Empty;
            dayOfWeek = -1;
            dateOfEvent = string.Empty;
            meleeUrl = string.Empty;
            signUpUrl = string.Empty;
            cost = string.Empty;
            notes = string.Empty;
            title = string.Empty;
            timeOfEvent = 0;
            storeInfo = null;
        }

        public EventInfoBinder(EventInfo e)
        {
            eventId = e.Id;
            eventType = e.EventType;            
            dayOfWeek = e.DayOfWeek;
            timeOfEvent = (e.TimeOfEvent.Hour * 3600) + (e.TimeOfEvent.Minute * 60) + e.TimeOfEvent.Second;
            dateOfEvent = e.DateOfEvent.HasValue ? e.DateOfEvent.Value.ToString("MM-dd-yyyy") : string.Empty;
            meleeUrl = e.MeleeUrl;
            signUpUrl = e.SignUpUrl;
            cost = e.Cost;
            notes = e.Notes;
            title = e.Title;
            storeId = e.StoreId;
        }

        public EventInfo ReturnEventInfo()
        {
            int hours = (int)(timeOfEvent / 3600);
            int mins = (int)(timeOfEvent % 3600 / 60);
            EventInfo eventInfo = new EventInfo();
            eventInfo.Id = eventId;
            eventInfo.EventType = eventType;
            eventInfo.DayOfWeek = dayOfWeek;
            eventInfo.TimeOfEvent = new TimeOnly(hours, mins);
            eventInfo.DateOfEvent = dateOfEvent.Length > 0 ? DateOnly.Parse(dateOfEvent) : null;
            eventInfo.MeleeUrl = meleeUrl;
            eventInfo.SignUpUrl = signUpUrl;
            eventInfo.Notes = notes; 
            eventInfo.Title = title;
            eventInfo.Cost = cost;
            eventInfo.StoreId = storeId;

            return eventInfo;
        }
    }
}
