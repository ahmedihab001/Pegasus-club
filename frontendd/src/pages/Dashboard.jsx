// src/pages/Dashboard.jsx (refactored)
import { useEffect, useState, useCallback } from "react";
import { useServices } from "../context/ServiceContext";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../locales/translations";

export default function Dashboard() {
  const { language } = useLanguage();
  const t = (key) => getTranslation(key, language);
  
  // Get injected services
  const { bookingService, eventService, programService } = useServices();
  
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserData = useCallback(async (userId) => {
    setLoading(true);
    try {
      const [bookingsData, eventsData, programsData] = await Promise.all([
        bookingService.getUserBookings(userId),
        eventService.getUserRegistrations(userId),
        programService.getUserEnrollments(userId)
      ]);
      setBookings(bookingsData || []);
      setRegisteredEvents(eventsData || []);
      setEnrolledPrograms(programsData || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load your activities");
    } finally {
      setLoading(false);
    }
  }, [bookingService, eventService, programService]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserData(parsedUser._id);
    } else {
      setLoading(false);
      setError("User not found. Please login again.");
    }
  }, [fetchUserData]);

  const upcomingItems = () => {
    const now = new Date();
    const sportItems = bookings
      .filter(b => b?.sessionDateTime && new Date(b.sessionDateTime) > now)
      .map(b => ({
        id: b._id,
        type: "sport",
        title: b.sportName,
        coach: b.coach,
        day: b.day,
        time: b.time,
        datetime: new Date(b.sessionDateTime),
        joinedAt: b.createdAt ? new Date(b.createdAt) : null,
      }));

    const eventItems = registeredEvents
      .filter(e => e?.eventDate && new Date(e.eventDate) > now)
      .map(e => ({
        id: e.id || e._id,
        type: "event",
        title: e.eventTitle,
        location: e.eventLocation,
        datetime: new Date(e.eventDate),
        joinedAt: e.registeredAt ? new Date(e.registeredAt) : null,
      }));

    const programItems = enrolledPrograms
      .filter(p => p?.enrolledAt)
      .map(p => ({
        id: p.id,
        type: "program",
        title: p.programName,
        coach: p.coach,
        duration: p.duration,
        schedule: p.schedule,
        price: p.price,
        datetime: new Date(p.enrolledAt),
        joinedAt: new Date(p.enrolledAt)
      }));

    return [...sportItems, ...eventItems, ...programItems].sort((a, b) => a.datetime - b.datetime);
  };

  const pastItems = () => {
    const now = new Date();
    const sportItems = bookings
      .filter(b => b?.sessionDateTime && new Date(b.sessionDateTime) <= now)
      .map(b => ({
        id: b._id,
        type: "sport",
        title: b.sportName,
        coach: b.coach,
        day: b.day,
        time: b.time,
        datetime: new Date(b.sessionDateTime),
      }));

    const eventItems = registeredEvents
      .filter(e => e?.eventDate && new Date(e.eventDate) <= now)
      .map(e => ({
        id: e.id || e._id,
        type: "event",
        title: e.eventTitle,
        location: e.eventLocation,
        datetime: new Date(e.eventDate),
      }));

    return [...sportItems, ...eventItems].sort((a, b) => b.datetime - a.datetime);
  };

  const totalBookings = bookings.length;
  const totalEvents = registeredEvents.length;
  const totalPrograms = enrolledPrograms.length;
  const totalActivities = totalBookings + totalEvents + totalPrograms;

  if (loading) return <div style={{ padding: "20px", color: "#fff" }}>{t('loading') || "Loading your dashboard..."}</div>;
  if (error) return <div style={{ padding: "20px", color: "#ff6b6b" }}>{error}</div>;
  if (!user) return <div style={{ padding: "20px", color: "#fff" }}>{t('loginRequired') || "Please log in to view dashboard"}</div>;

  const upcoming = upcomingItems();
  const past = pastItems();

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <h1>📊 {t('dashboard')}</h1>
      
      <div className="card" style={{ marginBottom: "30px" }}>
        <h2>{t('welcomeBack')}, {user.name}! 👋</h2>
        <p>📧 {t('email')}: {user.email}</p>
        <p>🆔 {t('memberId')}: {user.memberNumber || "N/A"}</p>
        <p>👑 {t('role')}: {user.role === "admin" ? "Administrator 👑" : "Member 🏃"}</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "5px" }}>⚽</div>
          <h3>{totalBookings}</h3>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>{t('sportBookings')}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "5px" }}>🎉</div>
          <h3>{totalEvents}</h3>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>{t('eventsJoined')}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "5px" }}>📚</div>
          <h3>{totalPrograms}</h3>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>{t('programsEnrolled')}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "5px" }}>🏆</div>
          <h3>{totalActivities}</h3>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>{t('totalActivities')}</p>
        </div>
      </div>

      {enrolledPrograms.length > 0 && (
        <>
          <h2>📚 {t('myPrograms')}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
            {enrolledPrograms.map((program) => (
              <div key={program.id} className="card">
                <h3>📚 {program.programName}</h3>
                <p><strong>👨‍🏫 {t('coach')}:</strong> {program.coach || "Professional Coach"}</p>
                <p><strong>⏱️ {t('duration')}:</strong> {program.duration}</p>
                <p><strong>📅 {t('schedule')}:</strong> {program.schedule || "Flexible"}</p>
                <p><strong>💰 {t('price')}:</strong> {program.price} EGP</p>
                <p><strong>📝 Enrolled on:</strong> {new Date(program.enrolledAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <h2>📅 {t('upcomingActivities')}</h2>
      {upcoming.length === 0 ? (
        <div className="card">
          <p>{t('noUpcoming')}</p>
          <p>Go to <button onClick={() => window.location.href = "/sports"} style={{ background: "none", color: "#c084fc", padding: 0, margin: 0, cursor: "pointer" }}>{t('sports')}</button>, <button onClick={() => window.location.href = "/events"} style={{ background: "none", color: "#c084fc", padding: 0, margin: 0, cursor: "pointer" }}>{t('events')}</button> or <button onClick={() => window.location.href = "/programs"} style={{ background: "none", color: "#c084fc", padding: 0, margin: 0, cursor: "pointer" }}>{t('programs')}</button> to join!</p>
        </div>
      ) : (
        upcoming.map((item) => (
          <div key={item.id} className="card" style={{ marginBottom: "15px" }}>
            {item.type === "sport" ? (
              <>
                <h3>⚽ {item.title}</h3>
                <p>👨‍🏫 {t('coach')}: {item.coach}</p>
                <p>⏰ Scheduled: {item.day} at {item.time}</p>
              </>
            ) : item.type === "event" ? (
              <>
                <h3>🎉 {item.title}</h3>
                <p>📍 {t('location')}: {item.location || "TBD"}</p>
              </>
            ) : (
              <>
                <h3>📚 {item.title}</h3>
                <p>👨‍🏫 {t('coach')}: {item.coach}</p>
                <p>⏱️ {t('duration')}: {item.duration}</p>
                <p>📅 {t('schedule')}: {item.schedule}</p>
              </>
            )}
            <p>📅 Date & time: {item.datetime.toLocaleString()}</p>
          </div>
        ))
      )}

      <h2>⏪ {t('pastActivities')}</h2>
      {past.length === 0 ? (
        <div className="card">
          <p>{t('noPast')}</p>
        </div>
      ) : (
        past.map((item) => (
          <div key={item.id} className="card" style={{ opacity: 0.7, marginBottom: "15px" }}>
            {item.type === "sport" ? (
              <>
                <h3>⚽ {item.title}</h3>
                <p>👨‍🏫 {t('coach')}: {item.coach}</p>
                <p>⏰ Was scheduled: {item.day} at {item.time}</p>
              </>
            ) : (
              <>
                <h3>🎉 {item.title}</h3>
                <p>📍 {t('location')}: {item.location || "TBD"}</p>
              </>
            )}
            <p>📅 Held on: {item.datetime.toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}