// src/components/admin/SportList.jsx (refactored)
import { useState } from "react";
import { useServices } from "../../context/ServiceContext";
import EditSportModal from "./EditSportModal";

export default function SportList({ sports, onRefresh }) {
  const { sportService } = useServices();   // ✅ injected service
  const [newSport, setNewSport] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    coaches: [],
  });
  const [editingSport, setEditingSport] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleAddSport = async () => {
    if (!newSport.name || !newSport.price) {
      alert("Name and price required");
      return;
    }
    try {
      await sportService.createSport(newSport);
      alert("Sport added successfully!");
      setNewSport({ name: "", description: "", image: "", price: "", coaches: [] });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Error adding sport: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteSport = async (sportId) => {
    if (!window.confirm("Delete this sport?")) return;
    try {
      await sportService.deleteSport(sportId);
      alert("Sport deleted!");
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const openEditModal = (sport) => {
    setEditingSport(JSON.parse(JSON.stringify(sport)));
    setShowEditModal(true);
  };

  return (
    <div>
      <h2>🏆 Manage Sports</h2>
      <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>➕ Add New Sport</h3>
        <div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
          <input
            placeholder="Name"
            value={newSport.name}
            onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          />
          <input
            placeholder="Description"
            value={newSport.description}
            onChange={(e) => setNewSport({ ...newSport, description: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          />
          <input
            placeholder="Image URL"
            value={newSport.image}
            onChange={(e) => setNewSport({ ...newSport, image: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          />
          <input
            placeholder="Price (EGP)"
            type="number"
            value={newSport.price}
            onChange={(e) => setNewSport({ ...newSport, price: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
          />
          <button onClick={handleAddSport} style={{ background: "#3b82f6", padding: "8px", borderRadius: "6px", border: "none", cursor: "pointer", color: "white" }}>
            Add Sport
          </button>
        </div>
      </div>

      {sports.map((sport) => (
        <div key={sport._id} className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3>{sport.name}</h3>
              <p>{sport.description}</p>
              <p>💰 {sport.price} EGP</p>
            </div>
            <div>
              <button
                onClick={() => openEditModal(sport)}
                style={{ background: "#2196f3", marginRight: "10px", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", color: "white" }}
              >
                Edit
              </button>
              <button onClick={() => handleDeleteSport(sport._id)} style={{ background: "#f44336", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", color: "white" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      <EditSportModal
        isOpen={showEditModal}
        sport={editingSport}
        onClose={() => setShowEditModal(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}