import React, { useState, useEffect, useMemo } from "react";
import { Button, Modal, Tabs, Tab, Row, Form, Col } from "react-bootstrap";
import EventInfoForm from "./EventInfoForm";

import { dayIdToString, createTimeString } from "./DTCommonFunctions";

import $ from "jquery";

import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import "datatables.net-select-bs5";
import "datatables.net-responsive-bs5";

DataTable.use(DT);

const EventList = ({ Events, Stores, authData, ReloadEvents }) => {
  const [weeklyTableData, setWeeklyTableData] = useState([]);
  const [upcomingTableData, setUpcomingTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEventId, setEditEventId] = useState(0);

  const [curDayFilter, setCurDayFilter] = useState("All");
  const [curRegionFilter, setCurRegionFilter] = useState("All");
  const [curStoreFilter, setCurStoreFilter] = useState("All");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const tableKey = useMemo(() => JSON.stringify(authData), [authData]);

  const dayOptions = [0, 1, 2, 3, 4, 5, 6];
  const regionOptions = ["All", "IE", "LA", "OC", "High Desert", "SD", "Ventura"];

  const changeDayFilter = (event) => {
    filterTableData(event.target.value, curRegionFilter, curStoreFilter);
  };

  const changeRegionFilter = (event) => {
    filterTableData(curDayFilter, event.target.value, curStoreFilter);
  };

  const changeStoreFilter = (event) => {
    filterTableData(curDayFilter, curRegionFilter, event.target.value);
  };

  const filterTableData = (day, region, store) => {
    let tempWeeklyEvent = [];
    let tempUpcomingEvent = [];

    Events.forEach((x) => {
      if ((day == "All" || x.dayOfWeek == day) && (region == "All" || x.storeInfo.region == region) && (store == "All" || x.storeInfo.id == store) && x.eventType == "Weekly") tempWeeklyEvent.push(x);
      if ((region == "All" || x.storeInfo.region == region) && (store == "All" || x.storeInfo.id == store) && x.eventType != "Weekly") tempUpcomingEvent.push(x);
    });
    setWeeklyTableData(() => [...tempWeeklyEvent]);
    setUpcomingTableData(() => [...tempUpcomingEvent]);
    setCurStoreFilter(store);
    setCurDayFilter(day);
    setCurRegionFilter(region);
  };

  const displayModal = (eventId) => {
    setEditEventId(eventId);
    handleShowModal();
  };

  const displayNewModel = () => {
    setEditEventId(0);
    handleShowModal();
  };

  const createRowMarkup = (row, rowData) => {
    if (rowData.storeInfo.region == "High Desert") $(row).addClass("HighDesert");
    else $(row).addClass(rowData.storeInfo.region);
  };

  const columnDefsWeekly = [
    {
      data: "dayOfWeek",
      title: "Day",
      width: "5%",
      render: {
        display: (data) => {
          return dayIdToString(data);
        },
        sort: (data) => data,
      },
      responsivePriority: 1,
    },
    {
      data: "timeOfEvent",
      title: "Time",
      render: (data) => {
        return createTimeString(data);
      },
    },
    {
      data: "storeInfo.region",
      title: "Region",
      width: "10%",
    },
    { data: "storeInfo.storename", title: "Store", responsivePriority: 2 },
    { data: "cost", title: "Cost" },
    { data: "notes", title: "Info", width: "40%", responsivePriority: 3 },
    {
      title: "Edit",
      data: null,
      responsivePriority: -1,
      visible: authData.isAuthenticated && authData.user.roles.indexOf("Admin") != -1,
    },
  ];

  const columnDefsUpcoming = [
    {
      data: null,
      title: "Event Date",
      width: "10%",
      render: (data, type, row) => {
        if (type === "display" || type === "filter") {
          return `${row.dateOfEvent} @ ${createTimeString(row.timeOfEvent)}`;
        }
        // For sorting, return a combined Date object
        if (type === "sort") {
          return new Date(`${row.dateOfEvent} ${createTimeString(row.timeOfEvent)}`).getTime();
        }
        return data;
      },
      responsivePriority: 1,
    },
    {
      data: "storeInfo.region",
      title: "Region",
      width: "10%",
    },
    { data: "storeInfo.storename", title: "Store", width: "20%", responsivePriority: 2 },
    { data: "cost", title: "Cost" },
    {
      title: "Info",
      width: "40%",
      data: null,
      render: (data, type, row) => {
        let retString = "<strong>";
        retString += row.eventType == "Big Event" ? row.title : "Set Champ";
        retString += "</strong>";
        retString += row.notes.length > 0 ? ", <i>Info:</i> " + row.notes : "";
        return retString;
      },
      responsivePriority: 3,
    },
    {
      title: "Edit",
      data: null,
      responsivePriority: -1,
      visible: authData.isAuthenticated && authData.user.roles.indexOf("Admin") != -1,
    },
  ];

  const upcomingSlots = {
    5: (data, row) => (
      <>
        <Button variant="info" onClick={() => displayModal(row.eventId)}>
          Edit
        </Button>
      </>
    ),
  };

  const weeklySlots = {
    6: (data, row) => (
      <>
        <Button variant="info" onClick={() => displayModal(row.eventId)}>
          Edit
        </Button>
      </>
    ),
  };

  useEffect(() => {
    if (Events && Events.length > 0) {
      setWeeklyTableData(Events.filter((x) => x.eventType == "Weekly"));
      setUpcomingTableData(Events.filter((x) => x.eventType != "Weekly"));
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
          setWeeklyTableData(data.data.filter((x) => x.eventType == "Weekly"));
          setUpcomingTableData(data.data.filter((x) => x.eventType != "Weekly"));
        });
    }
  }, [Events, authData]);

  const createTableOptions = (columnDefs) => {
    return {
      columns: columnDefs,
      bDestroy: true,
      createdRow: (row, rowData) => {
        createRowMarkup(row, rowData);
      },
      responsive: true,
    };
  };

  return (
    <>
      <Form className="mb-4">
        <Row>
          <Col>
            <Form.Label>Day</Form.Label>
            <Form.Select onChange={changeDayFilter}>
              <option value="All">All</option>
              {dayOptions.map((x) => {
                return (
                  <option value={x} key={`d.${x}`}>
                    {dayIdToString(x)}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
          <Col>
            <Form.Label>Region</Form.Label>
            <Form.Select onChange={changeRegionFilter}>
              {regionOptions.map((x) => {
                return (
                  <option value={x} key={`r.${x}`}>
                    {x}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
          <Col>
            <Form.Label>Store</Form.Label>
            <Form.Select onChange={changeStoreFilter}>
              <option value="All">All</option>
              {Stores.map((x) => {
                return (
                  <option value={x.storeInfo.id} key={`s.${x.storeInfo.id}`}>
                    {x.storeInfo.storename}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
        </Row>
      </Form>

      <Tabs defaultActiveKey="weekly" id="tabs" className="mb-3">
        <Tab eventKey="weekly" title="Weeklies">
          <DataTable key={tableKey} className="table table-bordered" data={weeklyTableData} options={createTableOptions(columnDefsWeekly)} slots={weeklySlots}>
            <thead></thead>
          </DataTable>
        </Tab>
        <Tab eventKey="upcoming" title="Upcoming (Non-weekly)" mountOnEnter>
          <DataTable key={tableKey} className="table table-bordered" data={upcomingTableData} options={createTableOptions(columnDefsUpcoming)} slots={upcomingSlots}>
            <thead></thead>
          </DataTable>
        </Tab>
      </Tabs>
      {authData.isAuthenticated && authData.user.roles.indexOf("Admin") != -1 && (
        <Button variant="success" onClick={displayNewModel}>
          Add New Event
        </Button>
      )}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventInfoForm EventId={editEventId} CloseModal={handleCloseModal} Stores={Stores} ReloadEvents={ReloadEvents}></EventInfoForm>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default EventList;
