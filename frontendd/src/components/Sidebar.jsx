import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../locales/translations";

export default function Sidebar({ isOpen, toggleSidebar, isMobile }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [darkMode, setDarkMode] = useState(true);
  const { language, toggleLanguage } = useLanguage();
  const t = (key) => getTranslation(key, language);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? "✕" : "☰"}
      </button>

      <div className={`sidebar ${isOpen ? "open" : "closed"} ${isMobile ? "mobile" : ""}`}>
        <div className="logo">
          {/* ✅ Replaced broken image with a styled div */}
          <div style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #a855f7, #3b82f6)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            marginRight: "12px"
          }}>
            🐴
          </div>
          <span className="logo-text">Pegasus Club</span>
          <div className="logo-sub">Sports Club</div>
        </div>

        {isMobile && isOpen && (
          <button className="mobile-close-btn" onClick={toggleSidebar}>✕</button>
        )}

        <div className="section-title">{t('main')}</div>
        <NavLink to="/dashboard">📊 {t('dashboard')}</NavLink>
        <NavLink to="/sports">⚽ {t('sports')}</NavLink>
        <NavLink to="/programs">📚 {t('programs')}</NavLink>
        <NavLink to="/schedule">📅 {t('schedule')}</NavLink>
        <NavLink to="/events">🎉 {t('events')}</NavLink>

        <div className="section-title">{t('management')}</div>
        <NavLink to="/profile">👤 {t('profile')}</NavLink>
        
        {/* Admin only */}
        {role === "admin" && (
          <>
            <NavLink to="/admin">👑 {t('admin')}</NavLink>
            <NavLink to="/workers">👥 Workers</NavLink>
          </>
        )}
        
        {/* Coach only */}
        {role === "coach" && (
          <NavLink to="/coach-dashboard">🏋️ Coach Dashboard</NavLink>
        )}
        
        <NavLink to="/card">💳 {t('card')}</NavLink>
        <NavLink to="/payment">💰 {t('payment')}</NavLink>

        {/* Language Toggle Button */}
        <button 
          onClick={toggleLanguage}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            background: darkMode ? "#334155" : "#e2e8f0",
            color: darkMode ? "#fff" : "#1e293b",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "600",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <span>{language === "en" ? "🌐" : "🌍"}</span>
          {language === "en" ? "العربية" : "English"}
        </button>

        {/* Dark Mode Toggle Button */}
        <button 
          onClick={toggleDarkMode} 
          className="dark-mode-btn"
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            background: darkMode ? "#fbbf24" : "#1e293b",
            color: darkMode ? "#1e293b" : "#fbbf24",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "600",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <span>{darkMode ? "☀️" : "🌙"}</span>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button onClick={handleLogout} className="logout-btn">🚪 {t('logout')}</button>
      </div>
    </>
  );
}