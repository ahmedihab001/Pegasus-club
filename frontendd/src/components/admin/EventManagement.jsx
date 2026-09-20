// src/components/admin/EventManagement.jsx (refactored)
import { useState } from "react";
import { useServices } from "../../context/ServiceContext";

export default function EventManagement({ events, onRefresh }) {
  const { eventService } = useServices();   // ✅ injected service
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: "",
    price: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [participants, setParticipants] = useState({});
  const [showParticipants, setShowParticipants] = useState({});
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!newEvent.title || !newEvent.date) {
      alert("Title and date required");
      return;
    }
    try {
      await eventService.createEvent(newEvent);
      alert("Event added successfully!");
      setNewEvent({ title: "", description: "", date: "", location: "", image: "", price: "" });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Error adding event: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (event) => setEditingEvent(event);
  
  const handleUpdate = async () => {
    setSaving(true);
    try {
      await eventService.updateEvent(editingEvent._id, editingEvent);
      alert("Event updated successfully!");
      setEditingEvent(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await eventService.deleteEvent(eventId);
      alert("Event deleted!");
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const fetchParticipants = async (eventId) => {
    if (participants[eventId]) return;
    try {
      const data = await eventService.getParticipants(eventId);
      setParticipants(prev => ({ ...prev, [eventId]: data }));
    } catch (err) {
      console.error("Failed to fetch participants", err);
      alert("Could not load participants");
    }
  };

  const toggleParticipants = (eventId) => {
    if (!showParticipants[eventId]) {
      fetchParticipants(eventId);
    }
    setShowParticipants(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  // Basic inline styles to match dark theme (adjust as needed)
  const inputStyle = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
  };

  const buttonStyle = {
    background: "#3b82f6",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    color: "white",
    marginRight: "8px",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    background: "#f44336",
  };

  return (
    <div>
      <h3>➕ Add New Event</h3>
      <div style={{ display: "grid", gap: "10px", maxWidth: "400px", marginBottom: "20px" }}>
        <input
          placeholder="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          style={{ ...inputStyle, minHeight: "60px" }}
        />
        <input
          type="datetime-local"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Location"
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Image URL"
          value={newEvent.image}
          onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Price (EGP)"
          type="number"
          value={newEvent.price}
          onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
          style={inputStyle}
        />
        <button onClick={handleAdd} style={buttonStyle}>
          Add Event
        </button>
      </div>

      <h3>📋 Existing Events</h3>
      {events.map((ev) => (
        <div key={ev._id} className="card" style={{ marginBottom: "10px" }}>
          {editingEvent && editingEvent._id === ev._id ? (
            <div>
              <input
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                placeholder="Title"
                style={inputStyle}
              />
              <textarea
                value={editingEvent.description}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                style={{ ...inputStyle, minHeight: "60px" }}
              />
              <input
                type="datetime-local"
                value={editingEvent.date?.slice(0, 16)}
                onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                style={inputStyle}
              />
              <input
                value={editingEvent.location}
                onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                placeholder="Location"
                style={inputStyle}
              />
              <input
                value={editingEvent.image}
                onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                placeholder="Image URL"
                style={inputStyle}
              />
              <input
                value={editingEvent.price}
                onChange={(e) => setEditingEvent({ ...editingEvent, price: e.target.value })}
                placeholder="Price"
                style={inputStyle}
              />
              <button onClick={handleUpdate} disabled={saving} style={buttonStyle}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditingEvent(null)} style={{ background: "#666", ...buttonStyle }}>
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <h4>{ev.title}</h4>
              <p>{ev.description}</p>
              <p>Date: {new Date(ev.date).toLocaleString()}</p>
              <p>Location: {ev.location}</p>
              {ev.price && <p>Price: {ev.price} EGP</p>}
              <button onClick={() => handleEdit(ev)} style={buttonStyle}>
                Edit
              </button>
              <button onClick={() => handleDelete(ev._id)} style={deleteButtonStyle}>
                Delete
              </button>
              <button onClick={() => toggleParticipants(ev._id)} style={{ marginLeft: "10px", ...buttonStyle, background: "#8b5cf6" }}>
                {showParticipants[ev._id] ? "Hide Participants" : "View Participants"}
              </button>
              {showParticipants[ev._id] && (
                <div style={{ marginTop: "10px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
                  <strong>Participants ({participants[ev._id]?.length || 0}):</strong>
                  {participants[ev._id]?.length ? (
                    <ul>
                      {participants[ev._id].map((p) => (
                        <li key={p._id}>
                          {p.name} ({p.email}) – Member #{p.memberNumber || "N/A"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No participants yet.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}