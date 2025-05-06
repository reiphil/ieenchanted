using EFSecondLevelCache.Core;
using iee.domain.BinderModels;
using iee.domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iee.domain
{
    public class IEEDBService
    {
        private IEEDBContext _dbContext;

        public IEEDBService(IEEDBContext dbContext)
        {
            _dbContext = dbContext;
            _dbContext.Database.SetCommandTimeout(75);
        }

        public async Task<List<FullStoreModel>> GetFullStoreData()
        {
            List<FullStoreModel> returnModel = new List<FullStoreModel>();
            foreach (var s in await _dbContext.Stores.ToListAsync())
            {
                FullStoreModel fsm = new FullStoreModel();
                fsm.storeInfo = s;

                foreach (var url in _dbContext.StoreUrls.Where(x => x.StoreId == s.Id))
                {
                    fsm.URLS.Add(url.Url);
                }

                returnModel.Add(fsm);
            }

            return returnModel;
        }

        public async Task<FullStoreModel> GetStoreInfo(int storeId)
        {
            FullStoreModel model = new FullStoreModel();
            model.storeInfo = await _dbContext.Stores.FirstOrDefaultAsync(x => x.Id == storeId);
            model.URLS = await _dbContext.StoreUrls.Where(x => x.StoreId == storeId).Select(x => x.Url).ToListAsync();

            return model;
        }

        public async Task<EventInfo> GetEventInfo(int eventId)
        {
            return await _dbContext.EventInfos.FirstOrDefaultAsync(x => x.Id == eventId);
        }

        public async Task<List<EventInfoBinder>> GetAllEvents()
        {
            List<Store> stores = _dbContext.Stores.ToList();
            List<EventInfoBinder> liveEvents = new List<EventInfoBinder>();
            var events = await _dbContext.EventInfos.ToListAsync();
            foreach (var e in events)
            {
                if (e.DateOfEvent.HasValue && e.DateOfEvent >= DateOnly.FromDateTime(DateTime.Now))
                {
                    EventInfoBinder eib = new EventInfoBinder(e);
                    eib.storeInfo = stores.FirstOrDefault(x => x.Id == e.StoreId);
                    liveEvents.Add(eib);
                }
                else if (e.EventType == "Weekly")
                {
                    EventInfoBinder eib = new EventInfoBinder(e);
                    eib.storeInfo = stores.FirstOrDefault(x => x.Id == e.StoreId);
                    liveEvents.Add(eib);
                }
            }

            return liveEvents.OrderBy(x => x.dayOfWeek).ThenBy(x => x.timeOfEvent).ToList();
        }

        public async Task<List<EventInfoBinder>> GetAllLiveEvents()
        {
            List<Store> stores = _dbContext.Stores.ToList();
            List<EventInfoBinder> liveEvents = new List<EventInfoBinder>();
            foreach (var e in await _dbContext.EventInfos.Where(x => x.EventType != "Weekly").OrderBy(x => x.DateOfEvent).ToListAsync())
            {
                if (e.DateOfEvent.HasValue && e.DateOfEvent >= DateOnly.FromDateTime(DateTime.Now))
                {
                    EventInfoBinder eib = new EventInfoBinder(e);
                    eib.storeInfo = stores.FirstOrDefault(x => x.Id == e.StoreId);
                    liveEvents.Add(eib);
                }
            }

            return liveEvents;
        }

        public async Task<List<EventInfoBinder>> GetAllWeeklyEvents()
        {
            List<Store> stores = _dbContext.Stores.ToList();
            List<EventInfoBinder> weeklyEvents = new List<EventInfoBinder>();

            foreach (var e in await _dbContext.EventInfos.Where(x => x.EventType == "Weekly").ToListAsync())
            {
                EventInfoBinder eib = new EventInfoBinder(e);
                eib.storeInfo = stores.FirstOrDefault(x => x.Id == e.StoreId);
                weeklyEvents.Add(eib);
            }
            return weeklyEvents.OrderBy(x => x.dayOfWeek).ThenBy(x => x.timeOfEvent).ToList();
        }

        public async Task<List<JudgeInfo>> GetAllJudges()
        {
            return await _dbContext.JudgeInfos.ToListAsync();
        }

        public async Task<int> SaveEventInfo(EventInfo model)
        {
            try
            {
                EventInfo event_ = new EventInfo { Id = 0 };

                if (model.Id > 0)
                    event_ = _dbContext.EventInfos.FirstOrDefault(x => x.Id == model.Id);

                event_.Title = model.Title;
                event_.Cost = model.Cost;
                event_.Notes = model.Notes;
                event_.MeleeUrl = model.MeleeUrl;
                event_.SignUpUrl = model.SignUpUrl;
                event_.DateOfEvent = model.DateOfEvent;
                event_.DayOfWeek = model.DayOfWeek;
                event_.TimeOfEvent = model.TimeOfEvent;
                event_.EventType = model.EventType;
                event_.StoreId = model.StoreId;

                if (model.Id == 0)
                {
                    _dbContext.EventInfos.Add(event_);
                }
                await _dbContext.SaveChangesAsync();

                return event_.Id;
            }
            catch (Exception ex) { return 0; }
        }

        public async Task<List<FullStoreModel>> GetStores()
        {
            List<FullStoreModel> stores = new List<FullStoreModel>();
            List<EventInfoBinder> allEvents = await GetAllEvents();
            List<StoreUrl> storeUrls = await _dbContext.StoreUrls.ToListAsync();
            foreach (var store in await _dbContext.Stores.OrderBy(x => x.Storename).ToListAsync())
            {
                FullStoreModel m = new FullStoreModel();
                m.storeInfo = store;

                foreach (var u in storeUrls.Where(x => x.StoreId == store.Id).ToList())
                {
                    m.URLS.Add(u.Url);
                }

                m.WeeklyEvents = allEvents.Where(x => x.storeId == store.Id && x.eventType == "Weekly").OrderBy(x => x.dayOfWeek).ThenBy(x => x.timeOfEvent).ToList();
                m.UpcomingEvents = allEvents.Where(x => x.storeId == store.Id && x.eventType != "Weekly").OrderBy(x => x.dateOfEvent).ThenBy(x => x.timeOfEvent).ToList();

                stores.Add(m);
            }
            return stores;
        }

        public async Task<int> SaveStoreInfo(FullStoreModel model)
        {
            try
            {
                Store store = new Store { Id = 0 };

                if (model.storeInfo.Id > 0)
                {
                    store = _dbContext.Stores.FirstOrDefault(x => x.Id == model.storeInfo.Id);
                }

                store.Storename = model.storeInfo.Storename;
                store.Address = model.storeInfo.Address;
                store.City = model.storeInfo.City;
                store.Region = model.storeInfo.Region;
                store.Phone = model.storeInfo.Phone;
                store.Latitude = model.storeInfo.Latitude;
                store.Longitude = model.storeInfo.Longitude;
                store.Notes = model.storeInfo.Notes;

                if (model.storeInfo.Id == 0)
                {
                    _dbContext.Stores.Add(store);
                }
                await _dbContext.SaveChangesAsync();

                foreach (var storeUrl in _dbContext.StoreUrls.Where(x => x.StoreId == store.Id).ToList())
                {
                    _dbContext.Remove<StoreUrl>(storeUrl);
                    _dbContext.SaveChanges();
                }

                foreach (var url in model.URLS)
                {
                    StoreUrl sUrl = new StoreUrl();
                    sUrl.Url = url;
                    sUrl.StoreId = store.Id;

                    _dbContext.Add<StoreUrl>(sUrl);
                    _dbContext.SaveChanges();
                }

                return store.Id;
            }
            catch (Exception ex) { return 0; }
        }

        public async Task<string> DeleteEvent(int eventId)
        {
            EventInfo eventInfo = await _dbContext.EventInfos.FirstOrDefaultAsync(x => x.Id == eventId);
            if (eventInfo != null)
            {
                try
                {
                    _dbContext.Remove<EventInfo>(eventInfo);
                    _dbContext.SaveChanges();
                    return "Event Deleted.";
                }
                catch (Exception ex)
                {
                    return "Error deleting event.";
                }
            }
            return "Event was not deleted.";
        }

        public async Task<string> DeleteStore(int storeId)
        {
            Store store = await _dbContext.Stores.FirstOrDefaultAsync(x => x.Id == storeId);
            if (store != null)
            {
                try
                {
                    foreach(var url in _dbContext.StoreUrls.Where(x => x.StoreId == storeId))
                    {
                        _dbContext.Remove<StoreUrl>(url);
                    }
                    _dbContext.Remove<Store>(store);
                    _dbContext.SaveChanges();
                    return "Store Deleted.";
                }
                catch (Exception ex)
                {
                    return "Error deleting store.";
                }
            }
            return "Store was not deleted.";
        }

        public async Task<string> SaveUser(string username, string passHash)
        {
            if (_dbContext.Users.Any(x => x.Username.ToLower().Trim() == username.ToLower().Trim()))
            {
                throw new Exception("Username taken");
            }

            var user = new User
            {
                Id = 0,
                Username = username,
                PasswordHash = passHash
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return user.Username;
        }

        public async Task<User> GetUser(string username)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(x => x.Username.ToLower().Trim() == username.ToLower().Trim());
        }
    }
}
