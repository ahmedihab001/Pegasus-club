// src/pages/Signup.jsx (refactored)
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useServices } from "../context/ServiceContext";

export default function Signup() {
  const { authService } = useServices();   // ✅ injected service
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset all fields when the component mounts
  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, []);

  const signup = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await authService.signup(name, email, password);
      alert("Account created successfully! Please login.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Email might already exist.");
      setPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "rgba(15,23,42,0.8)",
      backdropFilter: "blur(10px)"
    }}>
      <div style={{
        background: "rgba(30,41,59,0.9)",
        padding: "40px",
        borderRadius: "24px",
        width: "100%",
        maxWidth: "450px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        border: "1px solid rgba(168,85,247,0.3)",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <span style={{ fontSize: "50px" }}>🦄</span>
          <h2 style={{ color: "#fff", marginTop: "10px" }}>Create Account</h2>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>Join Pegasus Club today</p>
        </div>

        <form autoComplete="off">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              borderRadius: "12px",
              border: "1px solid rgba(168,85,247,0.3)",
              background: "rgba(15,23,42,0.8)",
              color: "#fff",
              fontSize: "1rem"
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              borderRadius: "12px",
              border: "1px solid rgba(168,85,247,0.3)",
              background: "rgba(15,23,42,0.8)",
              color: "#fff",
              fontSize: "1rem"
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              borderRadius: "12px",
              border: "1px solid rgba(168,85,247,0.3)",
              background: "rgba(15,23,42,0.8)",
              color: "#fff",
              fontSize: "1rem"
            }}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "20px",
              borderRadius: "12px",
              border: "1px solid rgba(168,85,247,0.3)",
              background: "rgba(15,23,42,0.8)",
              color: "#fff",
              fontSize: "1rem"
            }}
          />
        </form>
        
        {error && <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "15px", textAlign: "center" }}>{error}</p>}
        
        <button
          onClick={signup}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #a855f7, #3b82f6)",
            border: "none",
            borderRadius: "12px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        
        <p style={{ textAlign: "center", marginTop: "20px", color: "#cbd5e1" }}>
          Already have an account? <Link to="/login" style={{ color: "#c084fc" }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}