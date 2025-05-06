import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import $ from "jquery";

import { Row, Col, Form, Container } from "react-bootstrap";

import { dayIdToString, createTimeString } from "./DTCommonFunctions";

import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import "datatables.net-select-bs5";
import "datatables.net-rowgroup-bs5";

DataTable.use(DT);

// Fix default icon issues (specific to React Leaflet)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const ieeIcon = L.icon({
  iconUrl: require("../icons/iee-orange-small-stroke.png"),
  iconSize: [32, 32],
  iconAchor: [16, 32],
});

const DailyEventMap = ({ Events, Stores }) => {
  const today = new Date();
  const [selectedOptions, setSelectedOptions] = useState([today.getDay(), 7, 8]);
  const [eventInfos, setEventInfos] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [stores, setStores] = useState([]);
  // const [curLocation, setLocation] = useState(null);

  const dateDisplayOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

  const createRowMarkup = (row, rowData) => {
    if (rowData.storeInfo.region == "High Desert") $(row).addClass("HighDesert");
    else $(row).addClass(rowData.storeInfo.region);
  };

  const mapRef = useRef(null);
  const mapDivRef = useRef(null);
  const baseMapLocation = [33.8809978418941, -117.59834592795457];
  const markerRefs = useRef({});
  const tableRef = useRef(null);

  const tableColumnDefs = [
    {
      data: null,
      header: "Event Date",
      width: "10%",
      render: (data, type, row) => {
        if (row.dayOfWeek >= 0) return dayIdToString(row.dayOfWeek) + " @ " + createTimeString(row.timeOfEvent);
        else return row.dateOfEvent + " @ " + createTimeString(row.timeOfEvent);
      },
      sort: (a, b) => {
        console.log(a);
        console.log(b);
        return 0;
      },
    },
    { data: "storeInfo.storename", header: "Store", width: "20%" },
    {
      data: "storeInfo.region",
      header: "Region",
      width: "10%",
    },
    {
      header: "Info",
      width: "40%",
      data: null,
      render: (data, type, row) => {
        return row.eventType != "Weekly" ? (row.eventType == "Big Event" ? "<strong>" + row.title + "</strong>" : "<strong>Set Champ</strong>") : "Weekly";
      },
    },
  ];

  const handleSelectedOptionsChange = (option) => {
    let ind = selectedOptions.indexOf(option);
    let curOptions = [...selectedOptions];
    if (ind > -1) {
      curOptions = curOptions.filter((_, index) => index !== ind);
    } else {
      curOptions = [...curOptions, option];
    }

    let tempEvents = [];

    eventInfos.forEach((e) => {
      if (e.eventType == "Weekly" && curOptions.includes(e.dayOfWeek)) tempEvents.push(e);
      else if (e.eventType == "Big Event" && curOptions.includes(7)) tempEvents.push(e);
      else if (e.eventType == "Set Champ" && curOptions.includes(8)) tempEvents.push(e);
    });

    tempEvents.sort((a, b) => {
      if (a.eventType < b.eventType) return -1;
      if (a.eventType > b.eventType) return 1;

      if (a.dayOfWeek < b.dayOfWeek) return -1;
      if (a.dayOfWeek > b.dayOfWeek) return 1;

      if (a.dayOfWeek == -1 && b.dayOfWeek == -1) {
        const dateA = new Date(a.dateOfEvent);
        const dateB = new Date(b.dateOfEvent);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
      }

      if (a.timeOfEvent < b.timeOfEvent) return -1;
      if (a.timeOfEvent > b.timeOfEvent) return 1;

      return 0;
    });

    setDisplayedEvents(() => [...tempEvents]);
    setSelectedOptions(() => [...curOptions]);
  };

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       setLocation({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //       });
  //     });
  //   }

  //   if (curLocation) centerOnCurLocation();
  // });

  // const centerOnCurLocation = () => {
  //   if (curLocation) {
  //     mapRef.current.flyTo([curLocation.latitude, curLocation.longitude], 10);
  //   } else {
  //     mapRef.current.flyTo(baseMapLocation, 9);
  //   }
  // };

  useEffect(() => {
    if (Events) {
      setEventInfos(Events);
      let tempEvents = [];
      Events.forEach((e) => {
        if (e.eventType == "Weekly" && selectedOptions.includes(e.dayOfWeek)) tempEvents.push(e);
        else if (e.eventType == "Big Event" && selectedOptions.includes(7)) tempEvents.push(e);
        else if (e.eventType == "Set Champ" && selectedOptions.includes(8)) tempEvents.push(e);
      });
      tempEvents.sort((a, b) => {
        if (a.eventType < b.eventType) return -1;
        if (a.eventType > b.eventType) return 1;

        if (a.dayOfWeek < b.dayOfWeek) return -1;
        if (a.dayOfWeek > b.dayOfWeek) return 1;

        if (a.dayOfWeek == -1 && b.dayOfWeek == -1) {
          const dateA = new Date(a.dateOfEvent);
          const dateB = new Date(b.dateOfEvent);
          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
        }

        if (a.timeOfEvent < b.timeOfEvent) return -1;
        if (a.timeOfEvent > b.timeOfEvent) return 1;

        return 0;
      });
      setDisplayedEvents(() => [...tempEvents]);
    } else {
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
          setEventInfos(data.data);

          let tempEvents = [];
          data.data.forEach((e) => {
            if (e.eventType == "Weekly" && selectedOptions.includes(e.dayOfWeek)) tempEvents.push(e);
            else if (e.eventType == "Big Event" && selectedOptions.includes(7)) tempEvents.push(e);
            else if (e.eventType == "Set Champ" && selectedOptions.includes(8)) tempEvents.push(e);
          });
          tempEvents.sort((a, b) => {
            if (a.eventType < b.eventType) return -1;
            if (a.eventType > b.eventType) return 1;

            if (a.dayOfWeek < b.dayOfWeek) return -1;
            if (a.dayOfWeek > b.dayOfWeek) return 1;

            if (a.dayOfWeek == -1 && b.dayOfWeek == -1) {
              const dateA = new Date(a.dateOfEvent);
              const dateB = new Date(b.dateOfEvent);
              if (dateA < dateB) return -1;
              if (dateA > dateB) return 1;
            }

            if (a.timeOfEvent < b.timeOfEvent) return -1;
            if (a.timeOfEvent > b.timeOfEvent) return 1;

            return 0;
          });
          setDisplayedEvents(() => [...tempEvents]);
        });
    }
    if (Stores) {
      setStores(Stores);
    } else {
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
          setStores(data.data);
        });
    }
  }, [Events, Stores]);

  return (
    <>
      <Container fluid>
        <Row className="mb-2">
          <div ref={mapDivRef}>
            <span>
              Today is <strong>{today.toLocaleDateString(undefined, dateDisplayOptions)}</strong>, there are <strong>{eventInfos.filter((x) => x.dayOfWeek == today.getDay()).length}</strong> weekly
              events today!{" "}
              {eventInfos.filter((x) => x.eventType != "Weekly").length > 0 && (
                <>
                  And <strong>{eventInfos.filter((x) => x.eventType != "Weekly").length}</strong> upcoming events!
                </>
              )}
            </span>
          </div>
        </Row>
        <Row className="mb-2">
          <Form>
            <Form.Check inline label="Sunday" name="group1" type="checkbox" checked={selectedOptions.includes(0)} onChange={() => handleSelectedOptionsChange(0)} />
            <Form.Check inline label="Monday" name="group1" type="checkbox" checked={selectedOptions.includes(1)} onChange={() => handleSelectedOptionsChange(1)} />
            <Form.Check inline label="Tuesday" name="group1" type="checkbox" checked={selectedOptions.includes(2)} onChange={() => handleSelectedOptionsChange(2)} />
            <Form.Check inline label="Wednesday" name="group1" type="checkbox" checked={selectedOptions.includes(3)} onChange={() => handleSelectedOptionsChange(3)} />
            <Form.Check inline label="Thursday" name="group1" type="checkbox" checked={selectedOptions.includes(4)} onChange={() => handleSelectedOptionsChange(4)} />
            <Form.Check inline label="Friday" name="group1" type="checkbox" checked={selectedOptions.includes(5)} onChange={() => handleSelectedOptionsChange(5)} />
            <Form.Check inline label="Saturday" name="group1" type="checkbox" checked={selectedOptions.includes(6)} onChange={() => handleSelectedOptionsChange(6)} />
            <Form.Check inline label="Big Events" name="group1" type="checkbox" checked={selectedOptions.includes(7)} onChange={() => handleSelectedOptionsChange(7)} />
            <Form.Check inline label="Set Champs" name="group1" type="checkbox" checked={selectedOptions.includes(8)} onChange={() => handleSelectedOptionsChange(8)} />
          </Form>
        </Row>
        <Row>
          <Col lg={7} sm={12}>
            <MapContainer
              center={baseMapLocation} // Latitude and Longitude
              zoom={9}
              style={{ height: "70vh", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors" />
              {displayedEvents.length > 0 && (
                <>
                  {displayedEvents.map((e) => (
                    <Marker
                      position={[e.storeInfo.latitude, e.storeInfo.longitude]}
                      key={e.eventId}
                      icon={ieeIcon}
                      ref={(el) => {
                        if (el) {
                          markerRefs.current[`${e.storeInfo.latitude},${e.storeInfo.longitude}`] = el;
                        }
                      }}
                    >
                      <Popup>
                        <strong>
                          <a href={"https://maps.google.com/?q=" + e.storeInfo.address + "," + e.storeInfo.storename} target="_blank" rel="noreferrer">
                            {e.storeInfo.storename}
                          </a>
                        </strong>
                        <br />
                        {stores.find((x) => x.storeInfo.id === e.storeInfo.id) && stores.find((x) => x.storeInfo.id === e.storeInfo.id).weeklyEvents.length > 0 && (
                          <>
                            <h6 className="mb-1">Weekly Events</h6>
                            <Container className="mb-2">
                              {stores
                                .find((x) => x.storeInfo.id === e.storeInfo.id)
                                .weeklyEvents.map((y) => (
                                  <Row key={y.eventId} className="mb-2">
                                    <strong>
                                      {dayIdToString(y.dayOfWeek)}s @ {createTimeString(y.timeOfEvent)} {y.cost.length > 0 ? "($" + y.cost + ")" : ""}
                                    </strong>
                                    <br />
                                    <i>{y.notes}</i>
                                    <br />
                                  </Row>
                                ))}
                            </Container>
                          </>
                        )}
                        {stores.find((x) => x.storeInfo.id === e.storeInfo.id) && stores.find((x) => x.storeInfo.id === e.storeInfo.id).upcomingEvents.length > 0 && (
                          <>
                            <h6>Upcoming Events</h6>
                            <Container>
                              {stores
                                .find((x) => x.storeInfo.id === e.storeInfo.id)
                                .upcomingEvents.map((y) => (
                                  <Row key={y.eventId} className="mb-2">
                                    <strong>{y.eventType == "Set Champ" ? <>Set Championship!</> : <>{y.title}</>}</strong>
                                    <br />
                                    <strong>
                                      {y.dateOfEvent} @ {createTimeString(y.timeOfEvent)} {y.cost.length > 0 ? "($" + y.cost + ")" : ""}
                                    </strong>
                                    <br />
                                    <i>{y.notes}</i>
                                    <br />
                                    {y.meleeUrl.length > 0 && (
                                      <>
                                        <a href={y.meleeUrl} target="_blank" rel="noreferrer">
                                          Melee Link
                                        </a>
                                        <br />
                                      </>
                                    )}
                                    {y.signUpUrl.length > 0 && (
                                      <>
                                        <a href={y.signUpUrl} target="_blank" rel="noreferrer">
                                          Sign Up Link
                                        </a>
                                        <br />
                                      </>
                                    )}
                                  </Row>
                                ))}
                            </Container>
                          </>
                        )}
                      </Popup>
                    </Marker>
                  ))}
                </>
              )}
            </MapContainer>
          </Col>
          <Col lg={5} sm={12}>
            <div>
              <h4>Click an event to find it on the map!</h4>
            </div>
            <div className="dataTable-wrapper">
              <DataTable
                className="table table-bordered"
                data={displayedEvents}
                options={{
                  paging: false,
                  scrollCollapse: true,
                  scrollY: "58vh",
                  columns: tableColumnDefs,
                  bDestroy: true,
                  rowGroup: {
                    dataSrc: "eventType",
                  },
                  createdRow: (row, data) => {
                    // Add a data-group attribute to rows for collapsing logic
                    createRowMarkup(row, data);
                    $(row).attr("data-group", data.group);
                    $(row).on("click", function () {
                      const key = `${data.storeInfo.latitude},${data.storeInfo.longitude}`;
                      const marker = markerRefs.current[key];
                      if (marker) {
                        marker.openPopup();
                        //mapRef.current.flyTo([data.storeInfo.latitude, data.storeInfo.longitude], 12);
                        if (mapDivRef.current) {
                          mapDivRef.current.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    });
                  },
                  order: [],
                }}
                tableRef={tableRef}
              >
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Store</th>
                    <th>Region</th>
                    <th>Info</th>
                  </tr>
                </thead>
              </DataTable>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DailyEventMap;
