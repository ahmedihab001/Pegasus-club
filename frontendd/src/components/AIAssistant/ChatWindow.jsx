// src/components/AIAssistant/ChatWindow.jsx
import { useEffect, useRef, useState } from "react";

export default function ChatWindow({ 
  messages, isTyping, isUserTyping, setIsUserTyping,
  showQuickActions, onSend, onClear, onClose, setShowQuickActions 
}) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!isUserTyping) setIsUserTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
    setIsUserTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleQuickAction = (action) => {
    onSend(action);
  };

  // Robot avatar emoji based on state
  const getRobotEmoji = () => {
    if (isTyping) return "🤖💭";         // thinking
    if (isUserTyping) return "🤖👀";     // curious / watching
    return "🤖💤";                       // idle / resting
  };

  // Status text in the subtitle
  const getStatusText = () => {
    if (isTyping) return "Thinking...";
    if (isUserTyping) return "Watching you type...";
    return "Online";
  };

  return (
    <div style={styles.chatWindow}>
      {/* Header with dynamic avatar and thinking bubble (dots) */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatarWrapper}>
            <div style={styles.avatar}>{getRobotEmoji()}</div>
            {isTyping && (
              <div style={styles.thinkingBubble}>
                <div style={styles.thinkingDots}>
                  <span className="dot">●</span>
                  <span className="dot">●</span>
                  <span className="dot">●</span>
                </div>
              </div>
            )}
          </div>
          <div>
            <div style={styles.title}>Pegasus AI <span style={styles.onlineDot} /></div>
            <div style={styles.subtitle}>{getStatusText()}</div>
          </div>
        </div>
        <div style={styles.headerButtons}>
          <button onClick={onClear} style={styles.iconButton}>🗑️</button>
          <button onClick={onClose} style={styles.iconButton}>✕</button>
        </div>
      </div>

      {/* Status bar (extra info) */}
      <div style={styles.statusBar}>
        <span>🧠</span>
        <span>Pegasus AI is {isTyping ? "thinking" : isUserTyping ? "watching" : "ready"} • Powered by intelligence</span>
      </div>

      {/* Messages area */}
      <div style={styles.messagesArea}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ ...styles.messageRow, justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
            {msg.sender === "ai" && <div style={styles.aiAvatar}>🤖</div>}
            <div style={{ ...styles.bubble, ...(msg.sender === "user" ? styles.userBubble : styles.aiBubble) }}>
              {msg.text}
            </div>
            {msg.sender === "user" && <div style={styles.userAvatar}>👤</div>}
          </div>
        ))}
        {isTyping && (
          <div style={styles.typingContainer}>
            <div style={styles.aiAvatar}>🤖</div>
            <div style={styles.typingBubble}>
              <div style={styles.typingText}>Pegasus AI is typing</div>
              <div style={styles.typingDots}>
                <span className="dot">●</span><span className="dot">●</span><span className="dot">●</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      {showQuickActions && messages.length < 3 && (
        <div style={styles.quickActions}>
          <div style={styles.quickActionsLabel}>QUICK ACTIONS</div>
          <div style={styles.quickActionsButtons}>
            <button onClick={() => handleQuickAction("book a sport")}>⚽ Book Sport</button>
            <button onClick={() => handleQuickAction("join an event")}>🎉 Join Event</button>
            <button onClick={() => handleQuickAction("enroll in program")}>📚 Enroll Program</button>
            <button onClick={() => handleQuickAction("sports")}>🏆 View Sports</button>
            <button onClick={() => handleQuickAction("events")}>🎪 View Events</button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Ask Pegasus AI anything..."
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          style={styles.input}
        />
        <button onClick={handleSend} disabled={!input.trim()} style={styles.sendButton}>
          ➤
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes typing { 0%,60%,100% { opacity:0.3; transform:translateY(0); } 30% { opacity:1; transform:translateY(-4px); } }
        @keyframes floatBubble { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
        .dot { animation: typing 1.4s infinite; display: inline-block; margin-right: 4px; }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}

const styles = {
  chatWindow: {
    position: "fixed", bottom: "20px", right: "20px",
    width: "clamp(340px, 85vw, 400px)", height: "clamp(500px, 75vh, 600px)",
    background: "#1e293b", borderRadius: "28px", display: "flex", flexDirection: "column",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", zIndex: 1000, overflow: "hidden",
    animation: "slideUp 0.3s ease-out"
  },
  header: { background: "linear-gradient(135deg, #1e1b4b, #2e1a4b)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(168,85,247,0.3)" },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px", position: "relative" },
  avatarWrapper: { position: "relative" },
  avatar: { width: "44px", height: "44px", background: "linear-gradient(135deg, #a855f7, #3b82f6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", transition: "all 0.2s" },
  thinkingBubble: {
    position: "absolute", top: "-30px", right: "-10px",
    background: "rgba(51,65,85,0.95)", padding: "8px 12px", borderRadius: "20px",
    display: "flex", alignItems: "center", justifyContent: "center",
    animation: "floatBubble 1s ease-in-out infinite",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  thinkingDots: { display: "flex", gap: "4px", fontSize: "14px" },
  title: { fontWeight: "bold", fontSize: "16px", display: "flex", alignItems: "center", gap: "6px" },
  onlineDot: { background: "#22c55e", width: "8px", height: "8px", borderRadius: "50%", display: "inline-block", animation: "pulse 1.5s infinite" },
  subtitle: { fontSize: "11px", color: "#94a3b8" },
  headerButtons: { display: "flex", gap: "8px" },
  iconButton: { background: "rgba(100,116,139,0.2)", border: "none", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "all 0.2s" },
  statusBar: { background: "rgba(168,85,247,0.1)", padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(168,85,247,0.2)", fontSize: "12px", color: "#c084fc" },
  messagesArea: { flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(15,23,42,0.5)" },
  messageRow: { display: "flex", alignItems: "flex-end", gap: "8px", animation: "fadeIn 0.3s ease-out" },
  aiAvatar: { width: "28px", height: "28px", background: "linear-gradient(135deg, #a855f7, #3b82f6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" },
  userAvatar: { width: "28px", height: "28px", background: "#3b82f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" },
  bubble: { maxWidth: "85%", padding: "10px 14px", borderRadius: "20px", color: "#fff", fontSize: "14px", lineHeight: "1.5", whiteSpace: "pre-wrap", wordBreak: "break-word", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" },
  userBubble: { background: "linear-gradient(135deg, #3b82f6, #2563eb)", borderRadius: "20px 20px 4px 20px" },
  aiBubble: { background: "rgba(51,65,85,0.9)", borderRadius: "20px 20px 20px 4px" },
  typingContainer: { display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "8px" },
  typingBubble: { background: "rgba(51,65,85,0.9)", padding: "12px 16px", borderRadius: "20px 20px 20px 4px", display: "flex", flexDirection: "column", gap: "2px" },
  typingText: { fontSize: "12px", color: "#cbd5e1", marginBottom: "4px" },
  typingDots: { display: "flex", gap: "4px", fontSize: "14px" },
  quickActions: { padding: "12px", background: "#0f172a", borderTop: "1px solid rgba(168,85,247,0.2)", borderBottom: "1px solid rgba(168,85,247,0.2)" },
  quickActionsLabel: { fontSize: "10px", color: "#94a3b8", marginBottom: "8px", letterSpacing: "1px" },
  quickActionsButtons: { display: "flex", gap: "8px", flexWrap: "wrap" },
  inputArea: { padding: "12px", background: "#0f172a", borderTop: "1px solid rgba(168,85,247,0.2)", display: "flex", gap: "10px", alignItems: "center" },
  input: { flex: 1, padding: "12px 16px", borderRadius: "24px", border: "1px solid rgba(168,85,247,0.3)", background: "#1e293b", color: "#fff", fontSize: "14px", outline: "none" },
  sendButton: { width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #3b82f6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "white" },
};