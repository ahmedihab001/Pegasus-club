// src/components/AIAssistant/AnimationOverlay.jsx
import { useEffect, useState } from "react";

export default function AnimationOverlay() {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserName(user.name);
        setUserRole(user.role);
      } catch (e) {}
    }
  }, []);

  const isAdmin = userRole === "admin";
  const greeting = isAdmin 
    ? `Hello Master ${userName || ""}! 👑🙇` 
    : (userName ? `Hello ${userName}, master! 🙇` : "Hello! 🙇");

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.speechBubble}>
          <div style={styles.speechText}>{greeting}</div>
          <div style={styles.speechTail} />
        </div>
        <div style={styles.robotContainer}>
          <div style={styles.robotEmoji}>🤖</div>
        </div>
      </div>
      <style>{`
        @keyframes bow {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          80% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes floatBubble {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000,
  },
  container: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  robotContainer: {
    width: "140px",
    height: "140px",
    background: "linear-gradient(135deg, #a855f7, #3b82f6)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "bow 1s ease-in-out 2",
    marginTop: "20px",
    boxShadow: "0 0 0 4px rgba(168,85,247,0.4)",
  },
  robotEmoji: { fontSize: "70px" },
  speechBubble: {
    position: "relative",
    background: "linear-gradient(135deg, #2d1b4e, #1e1b4b)",
    borderRadius: "40px",
    padding: "12px 36px",
    marginBottom: "30px",
    animation: "floatBubble 2s ease-in-out infinite, fadeInScale 0.5s ease-out",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2), 0 0 0 3px rgba(168,85,247,0.4)",
    maxWidth: "450px",
    minWidth: "280px",
    width: "auto",
  },
  speechText: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    letterSpacing: "1px",
    background: "linear-gradient(135deg, #c084fc, #60a5fa)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  speechTail: {
    position: "absolute",
    bottom: "-20px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "12px solid transparent",
    borderRight: "12px solid transparent",
    borderTop: "20px solid #1e1b4b",
    filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
  },
};