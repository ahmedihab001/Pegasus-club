import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";

import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";
import CoachRoute from "./components/CoachRoute";   // new

// Public pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

// Protected pages
import Dashboard from "./pages/Dashboard";
import Sports from "./pages/Sports";
import Programs from "./pages/Programs";
import Schedule from "./pages/Schedule";
import Admin from "./pages/Admin";
import Card from "./pages/Card";
import Payment from "./pages/Payment";
import Events from "./pages/Events";
import Profile from "./pages/Profile";

// New pages
import Workers from "./pages/Workers";
import CoachDashboard from "./pages/CoachDashboard";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes – require login */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/card" element={<Card />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/events" element={<Events />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin only */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/workers" element={<Workers />} />
              </Route>

              {/* Coach only */}
              <Route element={<CoachRoute />}>
                <Route path="/coach-dashboard" element={<CoachDashboard />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}