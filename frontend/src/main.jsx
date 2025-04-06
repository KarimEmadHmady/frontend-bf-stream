import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Dashboard from "./component/Dashboard.jsx";
import OrdersList from "./component/OrdersList.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/OrdersList" element={<OrdersList />} />
        </Routes>
      </Router>
    </ClerkProvider>
  </React.StrictMode>
);
