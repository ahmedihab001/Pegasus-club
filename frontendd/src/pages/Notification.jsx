import { useState, useEffect } from "react";

export default function Notification({ message, type, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const colors = {
    success: "#22c55e",
    error: "#ef4444",
    info: "#3b82f6",
    warning: "#f59e0b"
  };

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      background: colors[type] || colors.info,
      color: "white",
      padding: "12px 20px",
      borderRadius: "10px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      zIndex: 2000,
      animation: "slideIn 0.3s ease-out",
      cursor: "pointer"
    }} onClick={() => setIsVisible(false)}>
      {message}
    </div>
  );
}