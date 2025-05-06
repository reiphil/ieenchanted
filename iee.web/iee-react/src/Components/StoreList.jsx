import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import StoreInfoForm from "./StoreInfoForm";
import $ from "jquery";

import ReactDOM from "react-dom/client";
import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import "datatables.net-select-bs5";
import "datatables.net-responsive-bs5";

DataTable.use(DT);

const StoreList = ({ Stores, authData, ReloadStores }) => {
  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editStoreId, setEditStoreId] = useState(0);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [curRegionFilter, setCurRegionFilter] = useState("All");
  const [curStoreFilter, setCurStoreFilter] = useState("All");

  const regionOptions = ["All", "IE", "LA", "OC", "High Desert", "SD", "Ventura"];

  const changeRegionFilter = (event) => {
    filterTableData(event.target.value, curStoreFilter);
  };

  const changeStoreFilter = (event) => {
    filterTableData(curRegionFilter, event.target.value);
  };

  const filterTableData = (region, store) => {
    let tempStores = [];

    Stores.forEach((x) => {
      if ((region == "All" || x.storeInfo.region == region) && (store == "All" || x.storeInfo.id == store)) tempStores.push(x);
    });
    setTableData(() => [...tempStores]);
    setCurRegionFilter(region);
    setCurStoreFilter(store);
  };

  const tableRef = useRef(null);
  const tableKey = useMemo(() => JSON.stringify(authData), [authData]);
  const displayModal = (data, row) => {
    setEditStoreId(row.storeInfo.id);
    handleShowModal();
  };

  const displayNewModel = () => {
    setEditStoreId(0);
    handleShowModal();
  };

  const createRowMarkup = (row, rowData) => {
    if (rowData.storeInfo.region == "High Desert") $(row).addClass("HighDesert");
    else $(row).addClass(rowData.storeInfo.region);
  };

  const createTimeString = (seconds) => {
    var date = new Date(seconds * 1000);
    var hh = date.getUTCHours();
    var mm = date.getUTCMinutes();

    if (hh < 10) {
      hh = "0" + hh;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    if (hh >= 12) {
      if (hh > 12) hh = hh - 12;
      return hh + ":" + mm + " pm";
    }
    return hh + ":" + mm + " am";
  };

  const dayIdToString = (day) => {
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        return "N/A";
    }
  };

  const displayChildEvents = (data) => {
    console.log(data);
    return (
      <>
        {data.upcomingEvents.length > 0 && (
          <div className="alignLeft">
            <h5>Upcoming Events</h5>
            <ul>
              {data.upcomingEvents.map((e, index) => (
                <li key={index} className="alignLeft">
                  <span>
                    {e.dateOfEvent} @ {createTimeString(e.timeOfEvent)} <strong>{e.eventType == "Set Champ" ? "Set Championship" : e.title}</strong>
                    {e.cost.length > 0 ? "($" + e.cost + ")" : ""}
                    {e.notes.length > 0 ? ", Info: " + e.notes : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.weeklyEvents.length > 0 && (
          <div className="alignLeft">
            <h5>Weekly Events</h5>
            <ul>
              {data.weeklyEvents.map((e, index) => (
                <li key={index} className="alignLeft">
                  <span>
                    {dayIdToString(e.dayOfWeek)}s @ {createTimeString(e.timeOfEvent)} {e.cost.length > 0 ? "($" + e.cost + ")" : ""}
                    {e.notes.length > 0 ? ", Info: " + e.notes : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  };

  const urlLinks = (data, row) => {
    const generatedLinks = [];
    row.urls.forEach((e) => {
      if (e.search("instagram") > 0) {
        generatedLinks.push(
          <a href={e} target="_blank" rel="noreferrer" style={{ marginRight: "10px" }} key={row.storeInfo.storeId + "." + generatedLinks.length}>
            <img src={require("../icons/instagram.png")} height="25px" width="25px" alt="instagram" />
          </a>,
        );
      }
    });
    row.urls.forEach((e) => {
      if (e.search("facebook") > 0) {
        generatedLinks.push(
          <a href={e} target="_blank" rel="noreferrer" style={{ marginRight: "10px" }} key={row.storeInfo.storeId + "." + generatedLinks.length}>
            <img src={require("../icons/facebook.png")} height="25px" width="25px" alt="facebook" />
          </a>,
        );
      }
    });
    row.urls.forEach((e) => {
      if (e.search("x.com") > 0 || e.search("twitter") > 0) {
        generatedLinks.push(
          <a href={e} target="_blank" rel="noreferrer" style={{ marginRight: "10px" }} key={row.storeInfo.storeId + "." + generatedLinks.length}>
            <img src={require("../icons/twitter.png")} height="25px" width="25px" alt="twitter/x" />
          </a>,
        );
      }
    });
    row.urls.forEach((e) => {
      if (e.search("discord") > 0) {
        generatedLinks.push(
          <a href={e} target="_blank" rel="noreferrer" style={{ marginRight: "10px" }} key={row.storeInfo.storeId + "." + generatedLinks.length}>
            <img src={require("../icons/discord.png")} height="25px" width="25px" alt="discord" />
          </a>,
        );
      }
    });
    row.urls.forEach((e) => {
      if (e.search("instagram") == -1 && e.search("facebook") == -1 && e.search("twitter") == -1 && e.search("discord") == -1 && e.search("x.com") == -1) {
        generatedLinks.push(
          <a href={e} target="_blank" rel="noreferrer" style={{ marginRight: "10px" }} key={row.storeInfo.storeId + "." + generatedLinks.length}>
            <img src={require("../icons/web.png")} height="25px" width="25px" alt="web" />
          </a>,
        );
      }
    });

    return <>{generatedLinks}</>;
  };

  const columnDefs = [
    {
      data: null,
      orderable: false,
      defaultContent: "",
      className: "dt-control",
      responsivePriority: 1,
    },
    {
      data: "storeInfo.region",
      title: "Region",
      width: "10%",
    },
    { data: "storeInfo.storename", title: "Store", responsivePriority: 1 },
    { data: "storeInfo.phone", title: "Phone", responsivePriority: 2 },
    { data: "storeInfo.address", title: "Address", width: "40%", responsivePriority: 3 },
    { orderable: false, title: "Socials", data: null, width: "10%", responsivePriority: -1 },
    { title: "Edit", orderable: false, visible: authData.isAuthenticated && authData.user.roles.indexOf("Admin") != -1, data: null, responsivePriority: -1 },
  ];

  const slots = {
    5: (data, row) => urlLinks(data, row),
    6: (data, row) => (
      <>
        <Button variant="info" onClick={() => displayModal(data, row)}>
          Edit
        </Button>
      </>
    ),
  };

  useEffect(() => {
    if (Stores && Stores.length > 0) setTableData(Stores);
    else {
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
          setTableData(data.data);
        });
    }
  }, [Stores, authData]);

  return (
    <>
      <Form className="mb-4">
        <Row>
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

      <DataTable
        key={tableKey}
        className="table table-bordered"
        data={tableData}
        options={{
          responsive: true,
          columns: columnDefs,
          bDestroy: true,
          createdRow: (row, rowData) => {
            createRowMarkup(row, rowData);
          },
          order: [[2, "asc"]],

          drawCallback: function () {
            const api = this.api();

            api.rows().every(function () {
              const row = this.node();

              $(row)
                .find(".dt-control")
                .off("click")
                .on("click", function () {
                  const tr = $(this).closest("tr");
                  const rowData = api.row(tr);
                  if (rowData.child.isShown()) {
                    // If the child row is open, close it
                    rowData.child.hide();
                  } else {
                    // Otherwise, open the child row
                    const childRowContainer = document.createElement("div");
                    const root = ReactDOM.createRoot(childRowContainer);
                    root.render(displayChildEvents(rowData.data()));

                    rowData.child($(childRowContainer)).show();
                  }
                });
            });
          },
        }}
        slots={slots}
        tableRef={tableRef}
      >
        <thead></thead>
      </DataTable>
      {authData.isAuthenticated && authData.user.roles.indexOf("Admin") != -1 && (
        <Button variant="success" onClick={displayNewModel}>
          Add New Store
        </Button>
      )}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Store</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StoreInfoForm StoreId={editStoreId} CloseModal={handleCloseModal} ReloadStores={ReloadStores}></StoreInfoForm>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default StoreList;
