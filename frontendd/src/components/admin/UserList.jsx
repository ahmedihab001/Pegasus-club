// src/components/admin/UserList.jsx (refactored)
import { useState } from "react";
import { useServices } from "../../context/ServiceContext";
import EditUserModal from "./EditUserModal";

export default function UserList({ users, onRefresh, hideAddForm = false }) {
  const { adminService } = useServices();   // ✅ injected service
  const [filterRole, setFilterRole] = useState("user");
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const sortUsers = (userList) => {
    return [...userList].sort((a, b) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const filteredUsers = users.filter((user) => {
    if (filterRole === "all") return true;
    return user.role === filterRole;
  });

  const sortedUsers = sortUsers(filteredUsers);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Name, email and password required");
      return;
    }
    try {
      await adminService.createUser(newUser);
      alert("User created successfully!");
      setNewUser({ name: "", email: "", password: "", role: "user" });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      alert("User role updated!");
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Failed to update role: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user and all their bookings?")) return;
    try {
      await adminService.deleteUser(userId);
      alert("User deleted!");
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Failed to delete user: " + (err.response?.data?.message || err.message));
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  return (
    <div>
      <h2>👥 User Management</h2>

      {/* Only show Add New User form if hideAddForm is false */}
      {!hideAddForm && (
        <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
          <h3>➕ Add New User</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
            />
            <input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
            />
            <input
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", background: "#1e293b", color: "#fff", border: "1px solid #334155" }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={handleAddUser} style={{ background: "#3b82f6", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", color: "white" }}>
              Create User
            </button>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <button
          onClick={() => setFilterRole("user")}
          style={{
            background: filterRole === "user" ? "#3b82f6" : "#2d3748",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            color: "white",
          }}
        >
          👥 Regular Users
        </button>
        <button
          onClick={() => setFilterRole("admin")}
          style={{
            background: filterRole === "admin" ? "#ef4444" : "#2d3748",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            color: "white",
          }}
        >
          👑 Administrators
        </button>
        <button
          onClick={() => setFilterRole("all")}
          style={{
            background: filterRole === "all" ? "#10b981" : "#2d3748",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            color: "white",
          }}
        >
          📋 All Users
        </button>
      </div>

      {/* User Cards */}
      {sortedUsers.length === 0 ? (
        <p>No {filterRole === "admin" ? "administrators" : "users"} found.</p>
      ) : (
        sortedUsers.map((user) => (
          <div key={user._id} className="card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p><strong>Member ID:</strong> {user.memberNumber || "N/A"}</p>
            <p>
              Role:
              <select
                value={user.role}
                onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                style={{ marginLeft: "10px", background: "#1e293b", color: "#fff", border: "1px solid #334155", borderRadius: "4px", padding: "4px" }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <button onClick={() => openEditModal(user)} style={{ background: "#2196f3", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", color: "white" }}>
                Edit User
              </button>
              <button onClick={() => handleDeleteUser(user._id)} style={{ background: "#f44336", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", color: "white" }}>
                Delete User
              </button>
            </div>
            <h4>Bookings:</h4>
            {user.bookings?.length ? (
              <ul>
                {user.bookings.map((b) => (
                  <li key={b._id}>
                    {b.sportName} – {b.coach} – {b.day} {b.time}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bookings.</p>
            )}
          </div>
        ))
      )}

      {/* Edit User Modal - self-contained, uses adminService internally */}
      <EditUserModal
        isOpen={showEditModal}
        user={editingUser}
        onClose={() => setShowEditModal(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}