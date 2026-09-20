// src/components/AIAssistant/AIAvatar.jsx
export default function AIAvatar({ state = "waiting" }) {
  const getEmoji = () => {
    if (state === "waiting") return "🤖💭";
    if (state === "listening") return "🤖👂";
    if (state === "thinking") return "🤔🤖";
    return "🤖";
  };

  const animations = {
    waiting: "bounce 2s infinite",
    listening: "pulse 1.5s infinite",
    thinking: "pulse 1s infinite",
    default: "none",
  };

  return (
    <div
      style={{
        width: "44px",
        height: "44px",
        background: "linear-gradient(135deg, #a855f7, #3b82f6)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
        animation: animations[state] || "none",
        transition: "all 0.3s ease",
        boxShadow: "0 0 0 3px rgba(168,85,247,0.3)",
        position: "relative",
      }}
    >
      {getEmoji()}
      {state === "thinking" && (
        <div
          style={{
            position: "absolute",
            top: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)",
            borderRadius: "16px",
            padding: "4px 8px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            color: "#fff",
            pointerEvents: "none",
            animation: "fadeInUp 0.3s",
          }}
        >
          Thinking...
        </div>
      )}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.7; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}