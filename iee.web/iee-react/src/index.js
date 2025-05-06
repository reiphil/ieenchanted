import "bootstrap/dist/css/bootstrap.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-select-bs5/css/select.bootstrap5.min.css";
import "datatables.net-rowgroup-bs5/css/rowGroup.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";

import "@1stquad/react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css";

import "leaflet/dist/leaflet.css";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );

// root.render(<App />);

//const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
