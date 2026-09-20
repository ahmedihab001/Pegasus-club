// src/pages/Login.jsx (refactored)
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useServices } from "../context/ServiceContext";

export default function Login() {
  const { authService } = useServices();   // ✅ injected service
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { user, token } = await authService.login(email, password);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authService.forgotPassword(resetEmail);
      setMessage(res.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authService.verifyOtp(resetEmail, otp);
      setMessage("OTP verified! Enter your new password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(resetEmail, otp, newPassword);
      setMessage("Password reset successfully! You can now login.");
      setTimeout(() => {
        setShowForgot(false);
        setStep(1);
        setResetEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForgot(false);
    setStep(1);
    setResetEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    setError("");
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
        {!showForgot ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <span style={{ fontSize: "50px" }}>🦄</span>
              <h2 style={{ color: "#fff", marginTop: "10px" }}>Welcome Back</h2>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>Login to your account</p>
            </div>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                required
              />
              {error && <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "15px" }}>{error}</p>}
              <button
                type="submit"
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
                {loading ? "Loading..." : "Login"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <button
                onClick={() => setShowForgot(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#c084fc",
                  cursor: "pointer",
                  fontSize: "14px",
                  textDecoration: "underline"
                }}
              >
                Forgot password?
              </button>
            </div>

            <p style={{ textAlign: "center", marginTop: "20px", color: "#cbd5e1" }}>
              Don't have an account? <Link to="/signup" style={{ color: "#c084fc" }}>Sign up here</Link>
            </p>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <span style={{ fontSize: "40px" }}>🔐</span>
              <h2 style={{ color: "#fff", marginTop: "10px" }}>Reset Password</h2>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                {step === 1 && "Enter your email to receive OTP"}
                {step === 2 && "Enter the 6-digit code sent to your email"}
                {step === 3 && "Create your new password"}
              </p>
            </div>

            {message && (
              <div style={{
                background: "rgba(34,197,94,0.2)",
                border: "1px solid #22c55e",
                borderRadius: "12px",
                padding: "12px",
                marginBottom: "20px",
                color: "#22c55e",
                fontSize: "14px",
                textAlign: "center"
              }}>
                {message}
              </div>
            )}

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.2)",
                border: "1px solid #ef4444",
                borderRadius: "12px",
                padding: "12px",
                marginBottom: "20px",
                color: "#ef4444",
                fontSize: "14px",
                textAlign: "center"
              }}>
                {error}
              </div>
            )}

            {step === 1 && (
              <>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
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
                <button
                  onClick={handleForgotPassword}
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
                    marginBottom: "15px"
                  }}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
                <button
                  onClick={handleVerifyOTP}
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
                    marginBottom: "15px"
                  }}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <button
                  onClick={handleResetPassword}
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
                    marginBottom: "15px"
                  }}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                onClick={resetForm}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                ← Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}