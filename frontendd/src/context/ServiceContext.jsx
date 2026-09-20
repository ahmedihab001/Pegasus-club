// frontendd/src/context/ServiceContext.jsx
import React, { createContext, useContext } from "react";
import ApiClient from "../services/ApiClient";
import BookingService from "../services/BookingService";
import EventService from "../services/EventService";
import ProgramService from "../services/ProgramService";
import AuthService from "../services/AuthService";
import SportService from "../services/SportService";
import AdminService from "../services/AdminService";
import WorkerService from "../services/WorkerService";
import CoachService from "../services/CoachService";

const apiClient = new ApiClient("http://localhost:5000/api");

const bookingService = new BookingService(apiClient);
const eventService = new EventService(apiClient);
const programService = new ProgramService(apiClient);
const authService = new AuthService(apiClient);
const sportService = new SportService(apiClient);
const adminService = new AdminService(apiClient);
const workerService = new WorkerService(apiClient);
const coachService = new CoachService(apiClient);

export const ServiceContext = createContext({
  bookingService,
  eventService,
  programService,
  authService,
  sportService,
  adminService,
  workerService,
  coachService,
});

export const useServices = () => useContext(ServiceContext);

export const ServiceProvider = ({ children }) => (
  <ServiceContext.Provider
    value={{
      bookingService,
      eventService,
      programService,
      authService,
      sportService,
      adminService,
      workerService,
      coachService,
    }}
  >
    {children}
  </ServiceContext.Provider>
);