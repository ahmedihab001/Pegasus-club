// src/pages/Payment.jsx (refactored)
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useServices } from "../context/ServiceContext";

export default function Payment() {
  const { bookingService, eventService } = useServices();   // ✅ injected services
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [duplicateCheck, setDuplicateCheck] = useState(false);

  useEffect(() => {
    // ✅ Check for duplicate booking before showing payment page
    const checkDuplicate = async () => {
      if (bookingData && bookingData.type !== "event") {
        try {
          const result = await bookingService.checkDuplicate(
            bookingData.userId,
            bookingData.sportId,
            bookingData.coach,
            bookingData.day,
            bookingData.time
          );
          
          if (result.exists) {
            setDuplicateCheck(true);
            setError("❌ You already have a booking for this exact session! You cannot book the same slot twice.");
          }
        } catch (err) {
          console.error("Error checking duplicate:", err);
        }
      }
    };
    
    checkDuplicate();
  }, [bookingData, bookingService]);

  if (!bookingData) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>No booking selected</h2>
        <button onClick={() => navigate("/sports")}>Go back to Sports</button>
      </div>
    );
  }

  const handlePayment = async () => {
    if (duplicateCheck) {
      alert("❌ You already have a booking for this session!");
      navigate("/sports");
      return;
    }
    
    setProcessing(true);
    setError("");
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (bookingData.type === "event") {
        await eventService.registerForEvent(bookingData.eventId, bookingData.userId);
        alert("✅ Successfully joined the event!");
        navigate("/events");
      } else {
        const response = await bookingService.createBooking({
          userId: bookingData.userId,
          sportId: bookingData.sportId,
          sportName: bookingData.sportName,
          coach: bookingData.coach,
          day: bookingData.day,
          time: bookingData.time,
          price: bookingData.price
        });
        
        if (response && response._id) {  // success if we get a booking object
          alert("✅ Booking confirmed! Payment successful.");
          navigate("/schedule");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes("already have a booking")) {
        setError("❌ You already have a booking for this session! Cannot book the same slot twice.");
      } else {
        setError(err.response?.data?.message || "Operation failed. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", color: "#fff" }}>
      <h2>💳 Payment Summary</h2>
      
      {duplicateCheck && (
        <div className="card" style={{ background: "rgba(239,68,68,0.2)", borderColor: "#ef4444", marginBottom: "20px" }}>
          <p>⚠️ You already have a booking for this session!</p>
          <button onClick={() => navigate("/schedule")} style={{ background: "#3b82f6", marginTop: "10px" }}>
            View My Schedule
          </button>
        </div>
      )}
      
      <div className="card" style={{ marginBottom: "20px" }}>
        {bookingData.type === "event" ? (
          <>
            <p><strong>Event:</strong> {bookingData.eventTitle}</p>
            <p><strong>Type:</strong> Event Registration</p>
          </>
        ) : (
          <>
            <p><strong>Sport:</strong> {bookingData.sportName}</p>
            <p><strong>Coach:</strong> {bookingData.coach}</p>
            <p><strong>Day:</strong> {bookingData.day}</p>
            <p><strong>Time:</strong> {bookingData.time}</p>
          </>
        )}
        <p><strong>Amount:</strong> {bookingData.price} EGP</p>
      </div>

      <div style={{ 
        background: "#1e293b", 
        padding: "20px", 
        borderRadius: "12px",
        border: "1px solid rgba(168,85,247,0.3)"
      }}>
        <h3>💳 Card Details</h3>
        <input
          type="text"
          placeholder="Card Number"
          defaultValue="4242 4242 4242 4242"
          style={{ 
            width: "100%", 
            marginBottom: "10px", 
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#fff"
          }}
          disabled={duplicateCheck}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <input 
            type="text" 
            placeholder="MM/YY" 
            defaultValue="12/28" 
            style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
            disabled={duplicateCheck}
          />
          <input 
            type="text" 
            placeholder="CVC" 
            defaultValue="123" 
            style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
            disabled={duplicateCheck}
          />
        </div>
        
        {error && <p style={{ color: "#ef4444", marginTop: "10px" }}>{error}</p>}
        
        <button
          onClick={handlePayment}
          disabled={processing || duplicateCheck}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: duplicateCheck ? "#475569" : "linear-gradient(135deg, #a855f7, #3b82f6)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: duplicateCheck ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {processing ? "Processing..." : duplicateCheck ? "Already Booked" : "Pay Now"}
        </button>
        
        {!duplicateCheck && (
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "10px", textAlign: "center" }}>
            🔒 Secure payment powered by Pegasus Club
          </p>
        )}
      </div>
    </div>
  );
}