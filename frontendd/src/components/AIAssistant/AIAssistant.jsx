// src/components/AIAssistant/AIAssistant.jsx (refactored)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../../context/ServiceContext";
import AnimationOverlay from "./AnimationOverlay";
import ChatWindow from "./ChatWindow";
import { useAIConversation } from "./useAIConversation";

export default function AIAssistant() {
  const { sportService, eventService, programService, bookingService } = useServices(); // ✅ injected
  const [isOpen, setIsOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [user, setUser] = useState(null);
  const [sportsList, setSportsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [programsList, setProgramsList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (sportsList.length === 0) {
        sportService.getAllSports().then(setSportsList).catch(console.error);
      }
      if (eventsList.length === 0) {
        eventService.getAllEvents().then(setEventsList).catch(console.error);
      }
      if (programsList.length === 0) {
        programService.getAllPrograms().then(setProgramsList).catch(console.error);
      }
    }
  }, [isOpen, sportService, eventService, programService, sportsList.length, eventsList.length, programsList.length]);

  // ✅ Pass services to the hook
  const { messages, isTyping, showQuickActions, sendMessage, clearChat, setShowQuickActions } =
    useAIConversation(user, sportsList, eventsList, programsList, setIsOpen, navigate, {
      bookingService,
      eventService,
      programService,
    });

  const openChat = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      setIsOpen(true);
      setUnreadCount(0);
    }, 1500);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  if (showAnimation) return <AnimationOverlay />;

  if (!isOpen) {
    return (
      <button onClick={openChat} style={styles.floatingButton}>
        🤖
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
      </button>
    );
  }

  return (
    <ChatWindow
      messages={messages}
      isTyping={isTyping}
      isUserTyping={isUserTyping}
      setIsUserTyping={setIsUserTyping}
      showQuickActions={showQuickActions}
      onSend={sendMessage}
      onClear={clearChat}
      onClose={closeChat}
      setShowQuickActions={setShowQuickActions}
    />
  );
}

const styles = {
  floatingButton: {
    position: "fixed", bottom: "20px", right: "20px", width: "60px", height: "60px",
    borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #3b82f6)",
    border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.3), 0 0 0 4px rgba(168,85,247,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
    zIndex: 1000,
  },
  badge: {
    position: "absolute", top: "-5px", right: "-5px", background: "#ef4444", color: "white",
    borderRadius: "50%", width: "22px", height: "22px", fontSize: "12px",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold",
  },
};