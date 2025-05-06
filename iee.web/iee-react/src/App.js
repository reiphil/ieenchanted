import { Route, Routes } from "react-router-dom";
import "./App.css";
import React, { Component } from "react";
import AppRoutes from "./AppRoutes";
// import { Home } from "./Components/Home";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <div className="App">
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
            return <Route key={index} {...rest} element={element} />;
          })}
        </Routes>
      </div>
    );
  }
}
// function App() {
//   return (
//     <div className="App">
//       <Home />
//     </div>
//   );
// }

// export default App;
