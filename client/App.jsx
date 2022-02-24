import React, { createContext, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from "./containers/Dashboard.jsx";

export const TopicContext = React.createContext();

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Dashboard />
    </div>
  );
}

export default App;
