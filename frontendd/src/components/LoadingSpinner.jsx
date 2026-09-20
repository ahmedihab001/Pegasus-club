export default function LoadingSpinner() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px"
    }}>
      <div style={{
        width: "50px",
        height: "50px",
        border: "4px solid rgba(168,85,247,0.2)",
        borderTop: "4px solid #a855f7",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}