import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./ThemeContext.jsx";
import { SoilDataProvider } from "./SoilDataContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <SoilDataProvider>
        <App />
      </SoilDataProvider>
    </ThemeProvider>
  </React.StrictMode>
);
