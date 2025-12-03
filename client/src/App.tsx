import AppRoutes from "./screens/Routes";
import { BrowserRouter } from "react-router-dom";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
