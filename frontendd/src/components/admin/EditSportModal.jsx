// src/components/admin/EditSportModal.jsx (refactored)
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useServices } from "../../context/ServiceContext";

export default function EditSportModal({ isOpen, sport, onClose, onSuccess }) {
  const { sportService } = useServices();   // ✅ injected service
  const [editingSport, setEditingSport] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sport) {
      setEditingSport(JSON.parse(JSON.stringify(sport)));
    } else {
      setEditingSport(null);
    }
  }, [sport]);

  if (!isOpen || !editingSport) return null;

  const addCoachToEdit = () => {
    setEditingSport({
      ...editingSport,
      coaches: [...(editingSport.coaches || []), { name: "", schedule: [] }],
    });
  };

  const updateCoachField = (coachIndex, field, value) => {
    const newCoaches = [...(editingSport.coaches || [])];
    newCoaches[coachIndex][field] = value;
    setEditingSport({ ...editingSport, coaches: newCoaches });
  };

  const addScheduleToCoach = (coachIndex) => {
    const newCoaches = [...(editingSport.coaches || [])];
    newCoaches[coachIndex].schedule.push({ day: "", times: [] });
    setEditingSport({ ...editingSport, coaches: newCoaches });
  };

  const updateScheduleField = (coachIndex, scheduleIndex, field, value) => {
    const newCoaches = [...(editingSport.coaches || [])];
    newCoaches[coachIndex].schedule[scheduleIndex][field] = value;
    setEditingSport({ ...editingSport, coaches: newCoaches });
  };

  const addTimeToSchedule = (coachIndex, scheduleIndex) => {
    const newCoaches = [...(editingSport.coaches || [])];
    newCoaches[coachIndex].schedule[scheduleIndex].times.push("");
    setEditingSport({ ...editingSport, coaches: newCoaches });
  };

  const updateTime = (coachIndex, scheduleIndex, timeIndex, value) => {
    const newCoaches = [...(editingSport.coaches || [])];
    newCoaches[coachIndex].schedule[scheduleIndex].times[timeIndex] = value;
    setEditingSport({ ...editingSport, coaches: newCoaches });
  };

  const removeTime = (coachIndex, scheduleIndex, timeIndex) => {
    const newCoaches = [...(editingSport.coaches || [])];
    newCoaches[coachIndex].schedule[scheduleIndex].times.splice(timeIndex, 1);
    setEditingSport({ ...editingSport, coaches: newCoaches });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await sportService.updateSport(editingSport._id, editingSport);
      alert("Sport updated successfully!");
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
        overflowY: "auto",
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
          maxWidth: "800px",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 25px 40px rgba(0,0,0,0.5)",
          border: "1px solid rgba(168,85,247,0.3)",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#fff" }}>Edit Sport: {editingSport.name}</h2>
        <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
          <input
            value={editingSport.name}
            onChange={(e) => setEditingSport({ ...editingSport, name: e.target.value })}
            placeholder="Name"
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          />
          <input
            value={editingSport.description}
            onChange={(e) => setEditingSport({ ...editingSport, description: e.target.value })}
            placeholder="Description"
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          />
          <input
            value={editingSport.image}
            onChange={(e) => setEditingSport({ ...editingSport, image: e.target.value })}
            placeholder="Image URL"
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          />
          <input
            type="number"
            value={editingSport.price}
            onChange={(e) => setEditingSport({ ...editingSport, price: e.target.value })}
            placeholder="Price"
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          />
        </div>

        <h3 style={{ color: "#c084fc", marginBottom: "12px" }}>Coaches & Schedules</h3>
        {editingSport.coaches?.map((coach, ci) => (
          <div
            key={ci}
            style={{
              border: "1px solid #334155",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px",
              background: "#0f172a",
            }}
          >
            <input
              value={coach.name}
              onChange={(e) => updateCoachField(ci, "name", e.target.value)}
              placeholder="Coach name"
              style={{ width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#1e293b", color: "#fff" }}
            />
            {coach.schedule?.map((sch, si) => (
              <div key={si} style={{ marginTop: "8px", borderLeft: "2px solid #3b82f6", paddingLeft: "10px" }}>
                <input
                  value={sch.day}
                  onChange={(e) => updateScheduleField(ci, si, "day", e.target.value)}
                  placeholder="Day"
                  style={{ width: "100%", padding: "6px", marginBottom: "6px", borderRadius: "6px", border: "1px solid #334155", background: "#1e293b", color: "#fff" }}
                />
                <div>
                  <strong style={{ color: "#94a3b8", fontSize: "12px" }}>Times:</strong>
                  {sch.times?.map((t, ti) => (
                    <div key={ti} style={{ display: "inline-flex", margin: "4px" }}>
                      <input
                        value={t}
                        onChange={(e) => updateTime(ci, si, ti, e.target.value)}
                        style={{ width: "80px", padding: "4px", borderRadius: "4px", border: "1px solid #334155", background: "#1e293b", color: "#fff" }}
                      />
                      <button
                        onClick={() => removeTime(ci, si, ti)}
                        style={{ background: "#f44336", marginLeft: "4px", padding: "2px 6px", borderRadius: "4px", border: "none", cursor: "pointer", color: "white" }}
                      >
                        x
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addTimeToSchedule(ci, si)}
                    style={{ marginTop: "6px", padding: "4px 10px", background: "#3b82f6", border: "none", borderRadius: "4px", cursor: "pointer", color: "white" }}
                  >
                    + Add Time
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => addScheduleToCoach(ci)}
              style={{ marginTop: "8px", padding: "4px 12px", background: "#8b5cf6", border: "none", borderRadius: "4px", cursor: "pointer", color: "white" }}
            >
              + Add Day
            </button>
          </div>
        ))}
        <button
          onClick={addCoachToEdit}
          style={{ marginTop: "8px", padding: "8px 16px", background: "#10b981", border: "none", borderRadius: "6px", cursor: "pointer", color: "white" }}
        >
          + Add Coach
        </button>

        <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
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