// src/pages/Events.jsx (refactored)
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../context/ServiceContext";

export default function Events() {
  const { eventService } = useServices();
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingEventId, setProcessingEventId] = useState(null); // track per event
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsData, registrationsData] = await Promise.all([
        eventService.getAllEvents(),
        user._id ? eventService.getUserRegistrations(user._id) : []
      ]);
      
      setEvents(eventsData || []);
      setRegisteredEvents(registrationsData || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [eventService, user._id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isRegistered = (eventId) => {
    return registeredEvents.some(r => r.eventId === eventId);
  };

  const handleRegister = async (event) => {
    if (!user._id) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    
    setProcessingEventId(event._id);
    try {
      const result = await eventService.registerForEvent(event._id, user._id, user.name);
      alert(result.message || "✅ Successfully registered for event!");
      await loadData();
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.message || "Failed to register. Please try again.");
    } finally {
      setProcessingEventId(null);
    }
  };

  const handleCancel = async (eventId) => {
    if (!window.confirm("Are you sure you want to cancel your registration?")) return;
    
    setProcessingEventId(eventId);
    try {
      await eventService.cancelRegistration(eventId, user._id);
      alert("✅ Registration cancelled!");
      await loadData();
    } catch (err) {
      console.error("Cancellation error:", err);
      alert(err.response?.data?.message || "Failed to cancel registration");
    } finally {
      setProcessingEventId(null);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", color: "#fff" }}>Loading events...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "#ff6b6b" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <h1>🎉 Upcoming Events</h1>
      
      {events.length === 0 ? (
        <div className="card">
          <p>No events scheduled yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid-3">
          {events.map((event) => {
            const registered = isRegistered(event._id);
            const isProcessing = processingEventId === event._id;
            return (
              <div key={event._id} className="card">
                <img
                  src={event.image || "https://via.placeholder.com/300x150?text=Event"}
                  alt={event.title}
                  style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                />
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>📍 Location:</strong> {event.location || "TBD"}</p>
                <p><strong>💰 Price:</strong> {event.price} EGP</p>
                <p><strong>👥 Capacity:</strong> {event.capacity || "Unlimited"}</p>
                
                {user._id ? (
                  registered ? (
                    <button 
                      onClick={() => handleCancel(event._id)} 
                      style={{ background: "#ef4444", marginTop: "15px", width: "100%" }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "❌ Cancel Registration"}
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRegister(event)} 
                      style={{ background: "#22c55e", marginTop: "15px", width: "100%" }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "✅ Join Event"}
                    </button>
                  )
                ) : (
                  <button 
                    onClick={() => navigate("/login")} 
                    style={{ background: "#475569", marginTop: "15px", width: "100%" }}
                  >
                    Login to Join
                  </button>
                )}
                
                {registered && (
                  <p style={{ color: "#22c55e", marginTop: "10px", fontSize: "12px", textAlign: "center" }}>
                    ✓ You are registered for this event!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}