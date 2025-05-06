import { Home } from "./Components/Home";
import React from "react";
import TurnTimer from "./Components/TurnTimer";

const AppRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "/clock",
    element: <TurnTimer />,
  },
];

export default AppRoutes;
