// src/pages/Workers.jsx
import { useEffect, useState } from "react";
import { useServices } from "../context/ServiceContext";
import Toast from "../components/Toast";

export default function Workers() {
  const { adminService, workerService } = useServices();
  const [workers, setWorkers] = useState([]);
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const loadWorkers = async () => {
    setLoading(true);
    try {
      const data = await workerService.getWorkers(filterRole);
      setWorkers(data);
    } catch (err) {
      setToast({ text: "Failed to load workers", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, [filterRole]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      setToast({ text: "Role updated successfully!", type: "success" });
      loadWorkers();
    } catch (err) {
      setToast({ text: "Failed to update role", type: "error" });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? All their bookings will be lost.")) return;
    try {
      await adminService.deleteUser(userId);
      setToast({ text: "User deleted", type: "success" });
      loadWorkers();
    } catch (err) {
      setToast({ text: "Failed to delete user", type: "error" });
    }
  };

  // Role counts for tabs
  const roleCounts = workers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const roleTabs = [
    { value: "all", label: "All", count: workers.length },
    { value: "admin", label: "Admin", count: roleCounts.admin || 0 },
    { value: "coach", label: "Coach", count: roleCounts.coach || 0 },
    { value: "security", label: "Security", count: roleCounts.security || 0 },
    { value: "secretary", label: "Secretary", count: roleCounts.secretary || 0 },
    { value: "user", label: "User", count: roleCounts.user || 0 },
  ];

  const filteredWorkers = workers.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.memberNumber?.toString().includes(searchTerm)
  );

  // Helper to get avatar emoji/initial
  const getAvatar = (user) => {
    if (user.role === "admin") return "👑";
    if (user.role === "coach") return "🏋️";
    if (user.role === "security") return "🛡️";
    if (user.role === "secretary") return "📋";
    return "👤";
  };

  return (
    <div style={{ padding: "20px", color: "#fff", background: "#0f172a", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>👥 Workers Management</h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
          Manage all club staff – admins, coaches, security, secretaries, and regular users.
        </p>

        {/* Search bar */}
        <div style={{ marginBottom: "25px" }}>
          <input
            type="text"
            placeholder="🔍 Search by name, email or member number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#fff",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Role filter tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>
          {roleTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterRole(tab.value)}
              style={{
                background: filterRole === tab.value ? "#c084fc" : "transparent",
                color: filterRole === tab.value ? "#fff" : "#94a3b8",
                padding: "8px 20px",
                borderRadius: "30px",
                border: filterRole === tab.value ? "none" : "1px solid #334155",
                cursor: "pointer",
                fontWeight: "500",
                transition: "all 0.2s",
                fontSize: "14px",
              }}
            >
              {tab.label} <span style={{ marginLeft: "5px", fontSize: "12px", opacity: 0.8 }}>({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Workers grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>Loading workers...</div>
        ) : filteredWorkers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}>No workers found.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
            {filteredWorkers.map(user => (
              <div
                key={user._id}
                style={{
                  background: "#1e293b",
                  borderRadius: "16px",
                  padding: "20px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  border: "1px solid #334155",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}>
                      {getAvatar(user)}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{user.name}</h3>
                      <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>{user.email}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#64748b" }}>Member #{user.memberNumber || "N/A"}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px" }}
                      title="Delete user"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "15px", borderTop: "1px solid #334155", paddingTop: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <span style={{ color: "#94a3b8", fontSize: "12px" }}>Role</span>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        style={{
                          marginLeft: "8px",
                          background: "#0f172a",
                          color: "#fff",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="coach">Coach</option>
                        <option value="security">Security</option>
                        <option value="secretary">Secretary</option>
                      </select>
                    </div>
                    {user.membershipEndDate && (
                      <span style={{ fontSize: "11px", color: "#22c55e" }}>
                        Membership until: {new Date(user.membershipEndDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Worker details (only for worker roles) */}
                  {user.workerDetails && (user.workerDetails.shift || user.workerDetails.department) && (
                    <div style={{ marginTop: "12px", background: "#0f172a", borderRadius: "8px", padding: "10px" }}>
                      <div style={{ fontSize: "12px", fontWeight: "bold", color: "#c084fc", marginBottom: "6px" }}>🧑‍💼 Worker Info</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "12px" }}>
                        {user.workerDetails.shift && <span>🕒 Shift: {user.workerDetails.shift}</span>}
                        {user.workerDetails.department && <span>🏢 Dept: {user.workerDetails.department}</span>}
                        {user.workerDetails.hireDate && <span>📅 Hired: {new Date(user.workerDetails.hireDate).toLocaleDateString()}</span>}
                        {user.workerDetails.salary && <span>💰 Salary: {user.workerDetails.salary} EGP</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && <Toast message={toast.text} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}