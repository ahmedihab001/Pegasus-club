// src/components/admin/EditUserModal.jsx (refactored)
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useServices } from "../../context/ServiceContext";

export default function EditUserModal({ isOpen, user, onClose, onSuccess }) {
  const { adminService } = useServices();   // ✅ injected service
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditingUser({ ...user });
    } else {
      setEditingUser(null);
    }
  }, [user]);

  if (!isOpen || !editingUser) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare update data (exclude password if empty)
      const updateData = {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      };
      if (editingUser.password && editingUser.password.trim() !== "") {
        updateData.password = editingUser.password;
      }
      await adminService.updateUser(editingUser._id, updateData);
      alert("User updated successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "24px",
          borderRadius: "16px",
          width: "90%",
          maxWidth: "500px",
          boxShadow: "0 25px 40px rgba(0,0,0,0.5)",
          border: "1px solid rgba(168,85,247,0.3)",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#fff" }}>Edit User</h2>
        <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
          <input
            value={editingUser.name || ""}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            placeholder="Name"
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          />
          <input
            value={editingUser.email || ""}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            placeholder="Email"
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          />
          <input
            type="password"
            value={editingUser.password || ""}
            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
            placeholder="New password (leave empty to keep current)"
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          />
          <select
            value={editingUser.role || "user"}
            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1,
              padding: "10px",
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              background: "#334155",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}