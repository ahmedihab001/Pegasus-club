import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      let parsedUser = JSON.parse(storedUser);
      
      // Fix missing data
      if (isNaN(parsedUser.memberNumber) || !parsedUser.memberNumber) {
        parsedUser.memberNumber = 1;
      }
      if (!parsedUser.createdAt) {
        parsedUser.createdAt = new Date().toISOString();
      }
      if (!parsedUser.membershipEndDate) {
        let endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);
        parsedUser.membershipEndDate = endDate.toISOString();
      }
      
      setUser(parsedUser);
      localStorage.setItem("user", JSON.stringify(parsedUser));
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const getEndDate = () => {
    if (user?.membershipEndDate) {
      return new Date(user.membershipEndDate).toLocaleDateString();
    }
    return "N/A";
  };

  const getDaysLeft = () => {
    if (!user?.membershipEndDate) return 0;
    const endDate = new Date(user.membershipEndDate);
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const getProgress = () => {
    if (!user?.createdAt) return 0;
    const startDate = new Date(user.createdAt);
    const endDate = new Date(user.membershipEndDate || startDate);
    const today = new Date();
    const total = endDate - startDate;
    const elapsed = today - startDate;
    const progress = (elapsed / total) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (loading) return <div style={{ padding: "20px", color: "#fff" }}>Loading profile...</div>;
  if (!user) return <div style={{ padding: "20px", color: "#fff" }}>Please log in</div>;

  const daysLeft = getDaysLeft();
  const progress = getProgress();

  return (
    <div style={{ padding: "20px", color: "#fff", maxWidth: "800px", margin: "0 auto" }}>
      <h1>👤 My Profile</h1>
      
      <div className="card" style={{ marginBottom: "30px", textAlign: "center" }}>
        <div style={{
          width: "120px",
          height: "120px",
          background: "linear-gradient(135deg, #a855f7, #3b82f6)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 0 30px rgba(168,85,247,0.5)"
        }}>
          <span style={{ fontSize: "60px" }}>{user?.role === "admin" ? "👑" : "🦄"}</span>
        </div>
        
        <h2>{user?.name || "Member"}</h2>
        <p style={{ color: "#c084fc", marginBottom: "10px" }}>
          {user?.role === "admin" ? "Administrator 👑" : "Premium Member 🦄"}
        </p>
        <p>📧 {user?.email}</p>
        <p>🆔 Member Number: <strong style={{ color: "#fbbf24", fontSize: "1.3rem" }}>#{user?.memberNumber}</strong></p>
      </div>

      <div className="card" style={{ marginBottom: "30px" }}>
        <h3>📅 Membership Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginTop: "15px" }}>
          <div>
            <p><strong>📆 Start Date:</strong></p>
            <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
          </div>
          <div>
            <p><strong>⏰ End Date:</strong></p>
            <p>{getEndDate()}</p>
          </div>
          <div>
            <p><strong>⏳ Days Remaining:</strong></p>
            <p style={{ color: daysLeft < 30 ? "#ef4444" : "#22c55e", fontWeight: "bold", fontSize: "1.2rem" }}>
              {daysLeft} days
            </p>
          </div>
        </div>
        
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span>Membership Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "10px",
            height: "10px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              borderRadius: "10px",
              transition: "width 0.3s"
            }} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>✨ Member Benefits</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginTop: "15px" }}>
          <div>🏋️‍♂️ Free Gym Access</div>
          <div>🏊 Pool Access</div>
          <div>👨‍🏫 Personal Trainer (1 session/month)</div>
          <div>🎫 Event Discounts (20%)</div>
          <div>🅿️ Free Parking</div>
          <div>🥤 Complimentary Drinks</div>
        </div>
      </div>
    </div>
  );
}