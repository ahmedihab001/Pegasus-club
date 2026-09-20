import { useEffect, useState } from "react";
import { useServices } from "../context/ServiceContext";
import Toast from "../components/Toast";

export default function CoachDashboard() {
  const { coachService } = useServices();
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    schedule: "",
    capacity: 20,
    image: "",
  });

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const data = await coachService.getMyPrograms();
      setPrograms(data);
    } catch (err) {
      setToast({ text: "Failed to load programs", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleViewEnrollments = async (program) => {
    try {
      const data = await coachService.getProgramEnrollments(program._id);
      setEnrollments(data);
      setSelectedProgram(program);
    } catch (err) {
      setToast({ text: "Failed to load enrollments", type: "error" });
    }
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    try {
      await coachService.createProgram(newProgram);
      setToast({ text: "Program created!", type: "success" });
      setShowAddForm(false);
      setNewProgram({ name: "", description: "", duration: "", price: "", schedule: "", capacity: 20, image: "" });
      loadPrograms();
    } catch (err) {
      setToast({ text: "Failed to create program", type: "error" });
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (!window.confirm("Delete this program? All enrollments will be removed.")) return;
    try {
      await coachService.deleteProgram(programId);
      setToast({ text: "Program deleted", type: "success" });
      loadPrograms();
      if (selectedProgram?._id === programId) setSelectedProgram(null);
    } catch (err) {
      setToast({ text: "Delete failed", type: "error" });
    }
  };

  if (loading) return <div style={{ padding: "20px", color: "#fff" }}>Loading coach dashboard...</div>;

  return (
    <div style={{ padding: "20px", color: "#fff", background: "#0f172a", minHeight: "100vh" }}>
      <h1>🏋️ Coach Dashboard</h1>
      <button onClick={() => setShowAddForm(!showAddForm)} style={{ marginBottom: "20px" }}>
        {showAddForm ? "Cancel" : "+ Add New Program"}
      </button>

      {showAddForm && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3>➕ Add Program</h3>
          <form onSubmit={handleAddProgram} style={{ display: "grid", gap: "10px" }}>
            <input placeholder="Name" value={newProgram.name} onChange={(e) => setNewProgram({...newProgram, name: e.target.value})} required />
            <textarea placeholder="Description" value={newProgram.description} onChange={(e) => setNewProgram({...newProgram, description: e.target.value})} />
            <input placeholder="Duration (e.g., 8 weeks)" value={newProgram.duration} onChange={(e) => setNewProgram({...newProgram, duration: e.target.value})} />
            <input placeholder="Price (EGP)" type="number" value={newProgram.price} onChange={(e) => setNewProgram({...newProgram, price: e.target.value})} />
            <input placeholder="Schedule (e.g., Mon & Wed 5PM)" value={newProgram.schedule} onChange={(e) => setNewProgram({...newProgram, schedule: e.target.value})} />
            <input placeholder="Capacity" type="number" value={newProgram.capacity} onChange={(e) => setNewProgram({...newProgram, capacity: e.target.value})} />
            <input placeholder="Image URL (optional)" value={newProgram.image} onChange={(e) => setNewProgram({...newProgram, image: e.target.value})} />
            <button type="submit">Create Program</button>
          </form>
        </div>
      )}

      <div className="grid-3">
        {programs.map(p => (
          <div key={p._id} className="card">
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
              />
            )}
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>📅 {p.duration} | 💰 {p.price} EGP</p>
            <p>👥 Enrolled: {p.enrolledCount || 0} / {p.capacity}</p>
            <p>🗓️ Schedule: {p.schedule}</p>
            <button onClick={() => handleViewEnrollments(p)}>View Enrollments</button>
            <button onClick={() => handleDeleteProgram(p._id)} style={{ background: "#ef4444", marginLeft: "10px" }}>Delete</button>
          </div>
        ))}
      </div>

      {selectedProgram && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "16px", maxWidth: "500px", width: "90%", maxHeight: "80%", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>{selectedProgram.name} - Enrollments</h2>
              <button onClick={() => setSelectedProgram(null)}>✕</button>
            </div>
            {enrollments.length === 0 ? (
              <p>No enrollments yet.</p>
            ) : (
              <ul>
                {enrollments.map(e => (
                  <li key={e._id}>User: {e.userName || e.userId} | Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {toast && <Toast message={toast.text} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}