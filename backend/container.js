// backend/container.js
const BookingRepository = require("./repositories/BookingRepository");
const BookingService = require("./services/BookingService");
const BookingRoutes = require("./routes/bookingRoutes");

const EventRepository = require("./repositories/EventRepository");
const EventRegistrationRepository = require("./repositories/EventRegistrationRepository");
const EventService = require("./services/EventService");
const EventRoutes = require("./routes/events");

const ProgramRepository = require("./repositories/ProgramRepository");
const ProgramEnrollmentRepository = require("./repositories/ProgramEnrollmentRepository");
const ProgramService = require("./services/ProgramService");
const ProgramRoutes = require("./routes/programRoutes");

const UserRepository = require("./repositories/UserRepository");
const AuthService = require("./services/AuthService");
const AuthRoutes = require("./routes/authRoutes");

const SportRepository = require("./repositories/SportRepository");
const SportService = require("./services/SportService");
const SportRoutes = require("./routes/sportRoutes");

const AdminService = require("./services/AdminService");
const AdminRoutes = require("./routes/adminRoutes");

// ---------- NEW WORKER & COACH MODULES ----------
const WorkerService = require("./services/WorkerService");
const CoachService = require("./services/CoachService");
const WorkerRoutes = require("./routes/workerRoutes");
const CoachRoutes = require("./routes/coachRoutes");

// ---------- INSTANTIATE REPOSITORIES ----------
const bookingRepository = new BookingRepository();
const eventRepository = new EventRepository();
const eventRegistrationRepository = new EventRegistrationRepository();
const programRepository = new ProgramRepository();
const programEnrollmentRepository = new ProgramEnrollmentRepository();
const userRepository = new UserRepository();        // only one declaration
const sportRepository = new SportRepository();

// ---------- INSTANTIATE SERVICES ----------
const bookingService = new BookingService(bookingRepository);
const eventService = new EventService(eventRepository, eventRegistrationRepository);
const programService = new ProgramService(programRepository, programEnrollmentRepository);
const authService = new AuthService(userRepository);
const sportService = new SportService(sportRepository);
const adminService = new AdminService(userRepository, bookingRepository);

// NEW SERVICES (reuse existing repositories)
const workerService = new WorkerService(userRepository);
const coachService = new CoachService(programRepository, programEnrollmentRepository);

// ---------- INSTANTIATE ROUTES ----------
const bookingRoutes = new BookingRoutes(bookingService);
const eventRoutes = new EventRoutes(eventService);
const programRoutes = new ProgramRoutes(programService);
const authRoutes = new AuthRoutes(authService);
const sportRoutes = new SportRoutes(sportService);
const adminRoutes = new AdminRoutes(adminService);

// NEW ROUTES
const workerRoutes = new WorkerRoutes(workerService);
const coachRoutes = new CoachRoutes(coachService);

// ---------- EXPORT ALL ----------
module.exports = {
  bookingRoutes,
  eventRoutes,
  programRoutes,
  authRoutes,
  sportRoutes,
  adminRoutes,
  workerRoutes,
  coachRoutes,
};