import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import StoreList from "./StoreList";
import EventList from "./EventList";
import DailyEventMap from "./DailyEventMap";
import JudgeMap from "./JudgeMap";
import IENav from "./IENav";
import IENavFooter from "./IENavFooter";
import ErrorWrapper from "./ErrorWrapper";

const MainAppWrapper = () => {
  const [storeInfo, setStoreInfo] = useState([]);
  const [eventInfo, setEventInfo] = useState([]);
  const [authData, setAuthData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showErrorBody, setShowErrorBody] = useState(false);

  const reloadEvents = () => {
    fetch("IEEService/GetAllEvents/", {
      mode: "cors",
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        data.data.sort((a, b) => {
          return a.dayOfWeek - b.dayOfWeek || a.timeOfEvent - b.timeOfEvent;
        });
        setEventInfo(data.data);
      });
  };

  const reloadStores = () => {
    fetch("IEEService/GetStores/", {
      mode: "cors",
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        setStoreInfo(data.data);
      });
  };

  const setCurrentAuth = (authData) => {
    setAuthData(authData);
  };

  useEffect(() => {
    fetch("IEEService/GetStoresAndEvents/", {
      mode: "cors",
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        setStoreInfo(data.stores);
        setEventInfo(data.events);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setShowErrorBody(true);
      });
  }, []);

  return (
    <>
      <header>
        <IENav />
      </header>
      <main>
        {!isLoading && (
          <Tabs defaultActiveKey="map" id="tabs" className="mb-3">
            <Tab eventKey="map" title="Map" mountOnEnter unmountOnExit>
              <DailyEventMap Events={eventInfo} Stores={storeInfo} />
            </Tab>
            <Tab eventKey="events" title="Events" mountOnEnter>
              <EventList Events={eventInfo} Stores={storeInfo} authData={authData} ReloadEvents={reloadEvents} />
            </Tab>
            <Tab eventKey="stores" title="Stores" mountOnEnter>
              <StoreList Stores={storeInfo} authData={authData} ReloadStores={reloadStores} />
            </Tab>
            <Tab eventKey="judges" title="Judge Locator" mountOnEnter>
              <JudgeMap />
            </Tab>
          </Tabs>
        )}
        <ErrorWrapper ShowError={showErrorBody} Message="Excuse our dust, there appears to have been an error! Please try refreshing the page. If the error persists, please contact Phil!" />
      </main>
      <footer>
        <IENavFooter ReturnLogin={setCurrentAuth} />
      </footer>
    </>
  );
};

export default MainAppWrapper;
