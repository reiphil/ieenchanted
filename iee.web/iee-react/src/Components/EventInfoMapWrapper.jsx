import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const EventInfoMapWrapper = (Events) => {
  console.log(Events);
  return (
    <MapContainer
      center={[34.05606470302462, -117.18189698682656]} // Latitude and Longitude
      zoom={11}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors" />
      {Events.Events.length > 0 && (
        <>
          {Events.Events.map((e) => (
            <Marker position={[e.storeInfo.latitude, e.storeInfo.longitude]} key={e.id}>
              <Popup>Test</Popup>
            </Marker>
          ))}
        </>
      )}
    </MapContainer>
  );
};

export default EventInfoMapWrapper;
