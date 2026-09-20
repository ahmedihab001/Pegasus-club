// src/pages/Programs.jsx (refactored)
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../context/ServiceContext";

export default function Programs() {
  const { programService } = useServices();
  const [programs, setPrograms] = useState([]);
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingProgramId, setProcessingProgramId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    coach: "",
    schedule: "",
    capacity: 20
  });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [programsData, enrollmentsData] = await Promise.all([
        programService.getAllPrograms(),
        user._id ? programService.getUserEnrollments(user._id) : []
      ]);
      
      setPrograms(programsData || []);
      setEnrolledPrograms(enrollmentsData || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load programs");
    } finally {
      setLoading(false);
    }
  }, [programService, user._id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isEnrolled = (programId) => {
    return enrolledPrograms.some(e => e.programId === programId);
  };

  const getEnrollment = (programId) => {
    return enrolledPrograms.find(e => e.programId === programId);
  };

  const handleEnroll = async (program) => {
    if (!user._id) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    
    setProcessingProgramId(program._id);
    try {
      const result = await programService.enrollInProgram(program._id, user._id, user.name);
      alert(result.message || "✅ Successfully enrolled in program!");
      await loadData();
    } catch (err) {
      console.error("Enrollment error:", err);
      alert(err.response?.data?.message || "Failed to enroll. Please try again.");
    } finally {
      setProcessingProgramId(null);
    }
  };

  const handleCancel = async (programId) => {
    if (!window.confirm("Are you sure you want to cancel your enrollment?")) return;
    
    setProcessingProgramId(programId);
    try {
      await programService.cancelEnrollment(programId, user._id);
      alert("✅ Enrollment cancelled!");
      await loadData();
    } catch (err) {
      console.error("Cancellation error:", err);
      alert(err.response?.data?.message || "Failed to cancel enrollment");
    } finally {
      setProcessingProgramId(null);
    }
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    if (!newProgram.name || !newProgram.description || !newProgram.duration || !newProgram.price) {
      alert("Please fill all required fields");
      return;
    }
    
    try {
      await programService.createProgram({
        ...newProgram,
        price: parseInt(newProgram.price),
        capacity: parseInt(newProgram.capacity)
      });
      alert("✅ Program added successfully!");
      setShowAddForm(false);
      setNewProgram({
        name: "",
        description: "",
        duration: "",
        price: "",
        coach: "",
        schedule: "",
        capacity: 20
      });
      loadData();
    } catch (err) {
      console.error("Error adding program:", err);
      alert("Failed to add program");
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (!window.confirm("Delete this program? This will remove all enrollments.")) return;
    try {
      await programService.deleteProgram(programId);
      alert("✅ Program deleted!");
      loadData();
    } catch (err) {
      alert("Failed to delete program");
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", color: "#fff" }}>Loading programs...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "#ff6b6b" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>📚 Training Programs</h1>
        {isAdmin && (
          <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: "#10b981" }}>
            {showAddForm ? "✕ Cancel" : "+ Add Program"}
          </button>
        )}
      </div>

      {/* Add Program Form */}
      {showAddForm && isAdmin && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3>➕ Add New Program</h3>
          <form onSubmit={handleAddProgram}>
            <input type="text" placeholder="Program Name *" value={newProgram.name} onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })} style={{ width: "100%", margin: "5px 0", padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }} required />
            <textarea placeholder="Description *" value={newProgram.description} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })} style={{ width: "100%", margin: "5px 0", padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }} required />
            <input type="text" placeholder="Duration (e.g., 1 hour) *" value={newProgram.duration} onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })} style={{ width: "100%", margin: "5px 0", padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }} required />
            <input type="number" placeholder="Price (EGP) *" value={newProgram.price} onChange={(e) => setNewProgram({ ...newProgram, price: e.target.value })} style={{ width: "100%", margin: "5px 0", padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }} required />
            <input type="text" placeholder="Coach Name" value={newProgram.coach} onChange={(e) => setNewProgram({ ...newProgram, coach: e.target.value })} style={{ width: "100%", margin: "5px 0", padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }} />
            <input type="text" placeholder="Schedule (e.g., Mon & Wed 5PM)" value={newProgram.schedule} onChange={(e) => setNewProgram({ ...newProgram, schedule: e.target.value })} style={{ width: "100%", margin: "5px 0", padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }} />
            <input type="number" placeholder="Capacity" value={newProgram.capacity} onChange={(e) => setNewProgram({ ...newProgram, capacity: e.target.value })} style={{ width: "100%", margin: "5px 0", padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }} />
            <button type="submit" style={{ marginTop: "10px", background: "#22c55e" }}>✅ Add Program</button>
          </form>
        </div>
      )}

      {programs.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <p>No programs available yet.</p>
          {isAdmin && <p>Click "Add Program" to create one!</p>}
        </div>
      ) : (
        <div className="grid-3">
          {programs.map((program) => {
            const enrolled = isEnrolled(program._id);
            const enrollment = getEnrollment(program._id);
            const isProcessing = processingProgramId === program._id;
            
            return (
              <div key={program._id} className="card" style={{ position: "relative" }}>
                {isAdmin && (
                  <button onClick={() => handleDeleteProgram(program._id)} style={{ position: "absolute", top: "10px", right: "10px", background: "#ef4444", width: "30px", height: "30px", borderRadius: "50%", padding: "0" }}>✕</button>
                )}
                
                <h2>{program.name}</h2>
                <p>{program.description}</p>
                <p><strong>⏱️ Duration:</strong> {program.duration}</p>
                <p><strong>👨‍🏫 Coach:</strong> {program.coach || "Professional Coach"}</p>
                <p><strong>📅 Schedule:</strong> {program.schedule || "Flexible"}</p>
                <p><strong>💰 Price:</strong> {program.price} EGP</p>
                <p><strong>👥 Spots left:</strong> {program.capacity - (program.enrolledCount || 0)} / {program.capacity}</p>
                
                {user._id ? (
                  enrolled ? (
                    <>
                      <button onClick={() => handleCancel(program._id)} style={{ background: "#ef4444", marginTop: "15px", width: "100%" }} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "❌ Cancel Enrollment"}
                      </button>
                      {enrollment && (
                        <div style={{ marginTop: "10px", padding: "10px", background: "rgba(34,197,94,0.1)", borderRadius: "8px" }}>
                          <p style={{ fontSize: "12px", color: "#22c55e", margin: 0 }}>✓ Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <button onClick={() => handleEnroll(program)} style={{ background: "#22c55e", marginTop: "15px", width: "100%" }} disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "✅ Enroll Now"}
                    </button>
                  )
                ) : (
                  <button onClick={() => navigate("/login")} style={{ background: "#475569", marginTop: "15px", width: "100%" }}>
                    Login to Enroll
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}