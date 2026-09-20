// src/main.jsx (or index.js)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import { ServiceProvider } from "./context/ServiceContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <ServiceProvider>
        <App />
      </ServiceProvider>
    </LanguageProvider>
  </React.StrictMode>
);