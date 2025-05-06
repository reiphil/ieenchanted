import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { Row, Container, Button, Alert } from "react-bootstrap";

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

// const ieeIcon = L.icon({
//   iconUrl: require("../icons/iee-orange-small-stroke.png"),
//   iconSize: [32, 32],
//   iconAchor: [16, 32],
// });

const getIcon = (isRoadWarrior) => {
  if (isRoadWarrior) {
    return L.icon({
      iconUrl: require("../icons/iee-teal-small-stroke.png"),
      iconSize: [32, 32],
      iconAchor: [16, 32],
    });
  } else {
    return L.icon({
      iconUrl: require("../icons/iee-orange-small-stroke.png"),
      iconSize: [32, 32],
      iconAchor: [16, 32],
    });
  }
};

const JudgeMap = () => {
  const [judgeInfos, setJudgeInfo] = useState([]);
  // const [curLocation, setLocation] = useState(null);

  const mapRef = useRef(null);
  const mapDivRef = useRef(null);
  const baseMapLocation = [40.00720824923173, -96.06029968775468];
  const markerRefs = useRef({});

  const zoomToUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        mapRef.current.flyTo([position.coords.latitude, position.coords.longitude], 10);
      });
    }
  };

  useEffect(() => {
    fetch("IEEService/GetAllJudges/", {
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
        console.log(data);
        setJudgeInfo(data.judges);
      });
  }, []);

  return (
    <>
      <Container fluid>
        <Row className="mb-2">
          <div ref={mapDivRef}>
            <span>Info here is self provided by Judges themselves. If you would like to be a part of this map, please contact Phil!</span>
            <br />
            <span>
              <Button variant="outline-info" onClick={zoomToUser}>
                Click here
              </Button>{" "}
              to zoom to your position and see if a judge is in your area!
            </span>
          </div>
        </Row>
        <Row className="mb-2">
          <Alert variant="info">
            A note for store owners/tournament organizers: <br />
            * Just about every judge will travel to an event if a travel stipend covers them
            <br />* Some judges here are road warriors, listed with a teal icon, and are willing to drive outside their listed range to support you!
            <br />* Please contact any judge you&apos;re interested in via their preferred method.
          </Alert>
        </Row>

        <Row>
          <MapContainer
            center={baseMapLocation} // Latitude and Longitude
            zoom={5}
            style={{ height: "70vh", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors" />
            {judgeInfos.length > 0 && (
              <>
                {judgeInfos.map((e) => (
                  <Marker
                    position={[e.lat, e.long]}
                    key={e.id}
                    icon={getIcon(e.isRoadWarrior)}
                    ref={(el) => {
                      if (el) {
                        markerRefs.current[`${e.lat},${e.long}`] = el;
                      }
                    }}
                  >
                    <Popup>
                      <strong>{e.preferredName}</strong>
                      <br />
                      <strong>Please contact via:</strong> <span>{e.contactMethod}</span>
                      {e.blurb != null && e.blurb.length > 0 && (
                        <>
                          <br />
                          <span>{e.blurb}</span>
                        </>
                      )}
                      {e.isRoadWarrior == true && (
                        <>
                          <br />
                          <strong>Road Warrior willing to drive extended distances to help events.</strong>
                        </>
                      )}
                    </Popup>
                    {e.isRoadWarrior ? <Circle center={[e.lat, e.long]} radius={e.range} color="teal" /> : <Circle center={[e.lat, e.long]} radius={e.range} />}
                  </Marker>
                ))}
              </>
            )}
          </MapContainer>
        </Row>
      </Container>
    </>
  );
};

export default JudgeMap;
