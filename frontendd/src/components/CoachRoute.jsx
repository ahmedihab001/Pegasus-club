import { Navigate, Outlet } from "react-router-dom";

export default function CoachRoute() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || localStorage.getItem("role");

  if (role !== "coach") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}