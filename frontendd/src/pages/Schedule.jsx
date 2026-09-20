// src/pages/Schedule.jsx (refactored)
import { useEffect, useState, useCallback } from "react";
import { useServices } from "../context/ServiceContext";

export default function Schedule() {
  const { bookingService, eventService } = useServices();
  const [bookings, setBookings] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadData = useCallback(async () => {
    if (!user._id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const [bookingsData, eventsData] = await Promise.all([
        bookingService.getUserBookings(user._id),
        eventService.getUserRegistrations(user._id)
      ]);
      
      setBookings(bookingsData || []);
      setEventRegistrations(eventsData || []);
      setError("");
    } catch (err) {
      console.error("Error loading schedule:", err);
      setError(err.response?.data?.message || "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  }, [user._id, bookingService, eventService]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const cancelSportBooking = async (bookingId) => {
    if (!window.confirm("Cancel this sport booking?")) return;
    try {
      await bookingService.cancelBooking(bookingId);
      alert("Sport booking cancelled!");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel");
    }
  };

  const cancelEventRegistration = async (eventId) => {
    if (!window.confirm("Cancel event registration?")) return;
    try {
      await eventService.cancelRegistration(eventId, user._id);
      alert("Event registration cancelled!");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel");
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", color: "#fff" }}>Loading your schedule...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "#ff6b6b" }}>{error}</div>;
  }

  const totalItems = bookings.length + eventRegistrations.length;

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <h1>📅 My Schedule</h1>
      
      {totalItems === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <p>📭 No bookings or events yet.</p>
          <p>Go to <strong>Sports</strong> page to book a session or <strong>Events</strong> page to join events!</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}>
            <button onClick={() => window.location.href = "/sports"} style={{ background: "#22c55e" }}>🏃 Sports</button>
            <button onClick={() => window.location.href = "/events"} style={{ background: "#a855f7" }}>🎉 Events</button>
          </div>
        </div>
      ) : (
        <>
          {bookings.length > 0 && (
            <>
              <h2>⚽ Sport Sessions</h2>
              {bookings.map((booking) => (
                <div key={booking._id} className="card" style={{ marginBottom: "15px" }}>
                  <h3>⚽ {booking.sportName}</h3>
                  <p><strong>👨‍🏫 Coach:</strong> {booking.coach}</p>
                  <p><strong>⏰ Time:</strong> {booking.day} at {booking.time}</p>
                  <p><strong>💰 Price:</strong> {booking.price} EGP</p>
                  <button onClick={() => cancelSportBooking(booking._id)} style={{ background: "#ef4444", marginTop: "10px" }}>
                    Cancel Booking
                  </button>
                </div>
              ))}
            </>
          )}
          
          {eventRegistrations.length > 0 && (
            <>
              <h2>🎉 Events</h2>
              {eventRegistrations.map((reg) => (
                <div key={reg.id || reg._id} className="card" style={{ marginBottom: "15px" }}>
                  <h3>🎉 {reg.eventTitle}</h3>
                  <p><strong>📅 Date:</strong> {new Date(reg.eventDate).toLocaleDateString()}</p>
                  <p><strong>📍 Location:</strong> {reg.eventLocation || "TBD"}</p>
                  <p><strong>💰 Price:</strong> {reg.eventPrice} EGP</p>
                  <p><strong>📝 Registered on:</strong> {new Date(reg.registeredAt).toLocaleDateString()}</p>
                  <button onClick={() => cancelEventRegistration(reg.eventId)} style={{ background: "#ef4444", marginTop: "10px" }}>
                    Cancel Registration
                  </button>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}