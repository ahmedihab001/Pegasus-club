// src/pages/Admin.jsx (refactored with worker details)
import { useEffect, useState } from "react";
import { useServices } from "../context/ServiceContext";
import UserList from "../components/admin/UserList";
import SportList from "../components/admin/SportList";
import EventManagement from "../components/admin/EventManagement";

export default function Admin() {
  const { adminService, sportService, eventService } = useServices();

  const [users, setUsers] = useState([]);
  const [sports, setSports] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddUser, setShowAddUser] = useState(true);
  const [showUserList, setShowUserList] = useState(true);
  const [showSportSection, setShowSportSection] = useState(true);
  const [showEventSection, setShowEventSection] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, sportsData, eventsData] = await Promise.all([
        adminService.getAllUsers(),
        sportService.getAllSports(),
        eventService.getAllEvents(),
      ]);
      setUsers(usersData);
      setSports(sportsData);
      setEvents(eventsData);
    } catch (err) {
      console.error(err);
      alert("Failed to load data: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Statistics
  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalNormalUsers = totalUsers - totalAdmins;
  const totalSports = sports.length;
  const totalCoaches = sports.reduce((sum, sport) => sum + (sport.coaches?.length || 0), 0);
  const totalEvents = events.length;

  // -------------------- USER HANDLERS --------------------
  const updateUserRole = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      loadData();
      alert("User role updated!");
    } catch (err) {
      alert("Failed to update role: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user and all their bookings?")) return;
    try {
      await adminService.deleteUser(userId);
      loadData();
      alert("User deleted!");
    } catch (err) {
      alert("Failed to delete user: " + (err.response?.data?.message || err.message));
    }
  };

  const addUser = async (userData) => {
    try {
      await adminService.createUser(userData);
      alert("User created successfully!");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  // -------------------- SPORT HANDLERS --------------------
  const addSport = async (sportData) => {
    try {
      await sportService.createSport(sportData);
      alert("Sport added successfully!");
      loadData();
    } catch (err) {
      alert("Error adding sport: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteSport = async (sportId) => {
    if (!window.confirm("Delete this sport?")) return;
    try {
      await sportService.deleteSport(sportId);
      loadData();
      alert("Sport deleted!");
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  // -------------------- EVENT HANDLERS --------------------
  const addEvent = async (eventData) => {
    try {
      await eventService.createEvent(eventData);
      alert("Event added successfully!");
      loadData();
    } catch (err) {
      alert("Error adding event: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await eventService.deleteEvent(eventId);
      loadData();
      alert("Event deleted!");
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div style={{ padding: "20px", color: "#fff" }}>Loading admin panel...</div>;

  return (
    <div style={{ padding: "20px", color: "#fff", minHeight: "100vh", background: "#0f172a" }}>
      <h1 style={{ marginBottom: "20px" }}>👑 Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", margin: "0", color: "#3b82f6" }}>{totalUsers}</h2>
          <p>👥 Total Users</p>
          <small>({totalNormalUsers} members, {totalAdmins} admins)</small>
        </div>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", margin: "0", color: "#22c55e" }}>{totalSports}</h2>
          <p>🏆 Total Sports</p>
        </div>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", margin: "0", color: "#fbbf24" }}>{totalCoaches}</h2>
          <p>🎓 Total Coaches</p>
        </div>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", margin: "0", color: "#8b5cf6" }}>{totalEvents}</h2>
          <p>🎪 Total Events</p>
        </div>
      </div>

      {/* Add New User - collapsible */}
      <div style={{ marginBottom: "20px", border: "1px solid #334155", borderRadius: "8px", overflow: "hidden" }}>
        <button onClick={() => setShowAddUser(!showAddUser)} style={{ width: "100%", padding: "12px 20px", background: "#1e293b", border: "none", color: "white", fontSize: "1rem", fontWeight: "bold", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>➕ Add New User</span>
          <span>{showAddUser ? "▼" : "▶"}</span>
        </button>
        {showAddUser && (
          <div style={{ padding: "20px", borderTop: "1px solid #334155" }}>
            <AddUserForm onAddUser={addUser} />
          </div>
        )}
      </div>

      {/* User List - collapsible */}
      <div style={{ marginBottom: "20px", border: "1px solid #334155", borderRadius: "8px", overflow: "hidden" }}>
        <button onClick={() => setShowUserList(!showUserList)} style={{ width: "100%", padding: "12px 20px", background: "#1e293b", border: "none", color: "white", fontSize: "1rem", fontWeight: "bold", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>👥 User List</span>
          <span>{showUserList ? "▼" : "▶"}</span>
        </button>
        {showUserList && (
          <div style={{ padding: "20px", borderTop: "1px solid #334155" }}>
            <UserList users={users} hideAddForm={true} onRefresh={loadData} />
          </div>
        )}
      </div>

      {/* Manage Sports - collapsible */}
      <div style={{ marginBottom: "20px", border: "1px solid #334155", borderRadius: "8px", overflow: "hidden" }}>
        <button onClick={() => setShowSportSection(!showSportSection)} style={{ width: "100%", padding: "12px 20px", background: "#1e293b", border: "none", color: "white", fontSize: "1rem", fontWeight: "bold", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>🏆 Manage Sports</span>
          <span>{showSportSection ? "▼" : "▶"}</span>
        </button>
        {showSportSection && (
          <div style={{ padding: "20px", borderTop: "1px solid #334155" }}>
            <SportList sports={sports} onRefresh={loadData} />
          </div>
        )}
      </div>

      {/* Manage Events - collapsible */}
      <div style={{ marginBottom: "20px", border: "1px solid #334155", borderRadius: "8px", overflow: "hidden" }}>
        <button onClick={() => setShowEventSection(!showEventSection)} style={{ width: "100%", padding: "12px 20px", background: "#1e293b", border: "none", color: "white", fontSize: "1rem", fontWeight: "bold", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>🎪 Manage Events</span>
          <span>{showEventSection ? "▼" : "▶"}</span>
        </button>
        {showEventSection && (
          <div style={{ padding: "20px", borderTop: "1px solid #334155" }}>
            <EventManagement events={events} onRefresh={loadData} />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- AddUserForm with Worker Details ----------
function AddUserForm({ onAddUser }) {
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
  const [workerDetails, setWorkerDetails] = useState({
    shift: "",
    department: "",
    hireDate: "",
    salary: "",
  });

  const isWorkerRole = ["coach", "security", "secretary"].includes(newUser.role);

  const handleSubmit = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Name, email and password required");
      return;
    }
    const userData = { ...newUser };
    if (isWorkerRole) {
      userData.workerDetails = workerDetails;
    }
    await onAddUser(userData);
    setNewUser({ name: "", email: "", password: "", role: "user" });
    setWorkerDetails({ shift: "", department: "", hireDate: "", salary: "" });
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff", flex: "1", minWidth: "150px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff", flex: "1", minWidth: "150px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff", flex: "1", minWidth: "120px" }}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          style={{ padding: "8px", borderRadius: "6px", background: "#1e293b", color: "#fff", border: "1px solid #334155", cursor: "pointer" }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="coach">Coach</option>
          <option value="security">Security</option>
          <option value="secretary">Secretary</option>
        </select>
        <button onClick={handleSubmit} style={{ padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Create User
        </button>
      </div>

      {/* Worker Details (only for worker roles) */}
      {isWorkerRole && (
        <div style={{ marginTop: "15px", borderTop: "1px solid #334155", paddingTop: "15px" }}>
          <h4 style={{ marginBottom: "10px", color: "#c084fc" }}>🧑‍💼 Worker Details</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <select
              value={workerDetails.shift}
              onChange={(e) => setWorkerDetails({ ...workerDetails, shift: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", background: "#0f172a", color: "#fff", border: "1px solid #334155" }}
            >
              <option value="">Select Shift</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
            <select
              value={workerDetails.department}
              onChange={(e) => setWorkerDetails({ ...workerDetails, department: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", background: "#0f172a", color: "#fff", border: "1px solid #334155" }}
            >
              <option value="">Select Department</option>
              <option value="security">Security</option>
              <option value="coaching">Coaching</option>
              <option value="administration">Administration</option>
            </select>
            <input
              type="date"
              placeholder="Hire Date"
              value={workerDetails.hireDate}
              onChange={(e) => setWorkerDetails({ ...workerDetails, hireDate: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", background: "#0f172a", color: "#fff", border: "1px solid #334155" }}
            />
            <input
              type="number"
              placeholder="Salary (EGP)"
              value={workerDetails.salary}
              onChange={(e) => setWorkerDetails({ ...workerDetails, salary: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", background: "#0f172a", color: "#fff", border: "1px solid #334155" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}