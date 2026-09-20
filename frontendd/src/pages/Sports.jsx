// src/pages/Sports.jsx (fully working with slot counts)
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../context/ServiceContext";

export default function Sports() {
  const { sportService, bookingService } = useServices();
  const [sports, setSports] = useState([]);
  const [openSportId, setOpenSportId] = useState(null);
  const [counts, setCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState(null);
  const [showAddSport, setShowAddSport] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [newSport, setNewSport] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    coaches: []
  });
  const [newCoach, setNewCoach] = useState({
    name: "",
    schedule: [{ day: "", times: [] }]
  });
  const [selectedSportForCoach, setSelectedSportForCoach] = useState(null);
  const [showAddCoach, setShowAddCoach] = useState(false);

  const navigate = useNavigate();
  const MAX = 5;

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sportsWishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const saveWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem("sportsWishlist", JSON.stringify(newWishlist));
  };

  const loadSports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sportService.getAllSports();
      setSports(data || []);
      setError("");
    } catch (err) {
      console.error("Failed to load sports:", err);
      setError(err.response?.data?.message || "Could not load sports");
    } finally {
      setLoading(false);
    }
  }, [sportService]);

  useEffect(() => {
    loadSports();
  }, [loadSports]);

  // Fetch slot counts for a specific sport (all coach/day/time combos)
  const fetchSlotCounts = async (sport) => {
    if (!sport.coaches || sport.coaches.length === 0) return;
    
    setLoadingCounts(true);
    const newCounts = { ...counts };
    const promises = [];

    sport.coaches.forEach(coach => {
      coach.schedule.forEach(daySchedule => {
        daySchedule.times.forEach(time => {
          const key = `${sport._id}|${coach.name}|${daySchedule.day}|${time}`;
          // Avoid re‑fetching if we already have a count
          if (newCounts[key] === undefined) {
            promises.push(
              bookingService.getSlotCount(sport._id, coach.name, daySchedule.day, time)
                .then(count => { newCounts[key] = count.count; })
                .catch(err => { console.error("Count fetch error:", err); newCounts[key] = 0; })
            );
          }
        });
      });
    });

    await Promise.all(promises);
    setCounts(newCounts);
    setLoadingCounts(false);
  };

  // When a sport's coach list is opened, fetch its slot counts
  const handleToggleCoaches = async (sportId) => {
    if (openSportId === sportId) {
      setOpenSportId(null);
    } else {
      setOpenSportId(sportId);
      const sport = sports.find(s => s._id === sportId);
      if (sport) await fetchSlotCounts(sport);
    }
  };

  const join = (sport, coach, day, time) => {
    const stored = localStorage.getItem("user");
    let user = null;
    try {
      user = stored ? JSON.parse(stored) : null;
    } catch {
      user = null;
    }

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    navigate("/payment", {
      state: {
        bookingData: {
          userId: user._id,
          sportId: sport._id,
          sportName: sport.name,
          coach,
          day,
          time,
          price: sport.price,
        },
      },
    });
  };

  const quickBook = (sport) => {
    const stored = localStorage.getItem("user");
    let user = null;
    try {
      user = stored ? JSON.parse(stored) : null;
    } catch {
      user = null;
    }

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    navigate("/payment", {
      state: {
        bookingData: {
          userId: user._id,
          sportId: sport._id,
          sportName: sport.name,
          coach: "Any Coach",
          day: "Flexible",
          time: "Flexible",
          price: sport.price,
        },
      },
    });
  };

  const toggleWishlist = (sportId) => {
    if (wishlist.includes(sportId)) {
      saveWishlist(wishlist.filter(id => id !== sportId));
    } else {
      saveWishlist([...wishlist, sportId]);
    }
  };

  const shareSport = (sport) => {
    if (navigator.share) {
      navigator.share({
        title: sport.name,
        text: sport.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${sport.name}: ${sport.description} - Price: ${sport.price} EGP`);
      alert("Sport details copied to clipboard!");
    }
  };

  const handleAddSport = async (e) => {
    e.preventDefault();
    try {
      const sportToAdd = {
        ...newSport,
        price: parseInt(newSport.price),
        coaches: []
      };
      await sportService.createSport(sportToAdd);
      alert("✅ Sport added successfully!");
      setShowAddSport(false);
      setNewSport({ name: "", description: "", price: "", image: "", coaches: [] });
      loadSports();
    } catch (err) {
      console.error("Error adding sport:", err);
      alert("❌ Failed to add sport: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteSport = async (sportId) => {
    if (window.confirm("Are you sure you want to delete this sport? This will also delete all coaches and bookings.")) {
      try {
        await sportService.deleteSport(sportId);
        alert("✅ Sport deleted successfully!");
        loadSports();
      } catch (err) {
        console.error("Error deleting sport:", err);
        alert("❌ Failed to delete sport");
      }
    }
  };

  const handleAddCoach = async (sportId) => {
    if (!newCoach.name || newCoach.schedule.length === 0) {
      alert("Please fill coach name and schedule");
      return;
    }
    try {
      await sportService.addCoachToSport(sportId, newCoach);
      alert("✅ Coach added successfully!");
      setShowAddCoach(false);
      setSelectedSportForCoach(null);
      setNewCoach({ name: "", schedule: [{ day: "", times: [] }] });
      loadSports();
    } catch (err) {
      console.error("Error adding coach:", err);
      alert("❌ Failed to add coach");
    }
  };

  const addScheduleDay = () => {
    setNewCoach({
      ...newCoach,
      schedule: [...newCoach.schedule, { day: "", times: [] }]
    });
  };

  const updateScheduleDay = (index, field, value) => {
    const updated = [...newCoach.schedule];
    updated[index][field] = value;
    setNewCoach({ ...newCoach, schedule: updated });
  };

  const addTimeToDay = (index) => {
    const updated = [...newCoach.schedule];
    updated[index].times.push("");
    setNewCoach({ ...newCoach, schedule: updated });
  };

  const updateTime = (dayIndex, timeIndex, value) => {
    const updated = [...newCoach.schedule];
    updated[dayIndex].times[timeIndex] = value;
    setNewCoach({ ...newCoach, schedule: updated });
  };

  const filteredSports = sports.filter(sport => {
    const matchesSearch = sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sport.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWishlist = showOnlyWishlist ? wishlist.includes(sport._id) : true;
    return matchesSearch && matchesWishlist;
  });

  if (loading) {
    return (
      <div style={{ padding: "20px", color: "#fff" }}>
        <h1>🏆 Sports</h1>
        <p>Loading sports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#ff6b6b" }}>
        <h1>🏆 Sports</h1>
        <p>⚠️ {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", background: "#0f172a", minHeight: "100vh", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <h1>🏆 Sports</h1>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="🔍 Search sports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#fff",
              width: "200px"
            }}
          />
          <button
            onClick={() => setShowOnlyWishlist(!showOnlyWishlist)}
            style={{
              background: showOnlyWishlist ? "#fbbf24" : "#334155",
              color: "#fff",
              padding: "10px 15px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            ⭐ Wishlist ({wishlist.length})
          </button>
          {isAdmin && (
            <button
              onClick={() => setShowAddSport(!showAddSport)}
              style={{
                background: "#10b981",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}
            >
              {showAddSport ? "✕ Cancel" : "+ Add New Sport"}
            </button>
          )}
        </div>
      </div>

      {showAddSport && isAdmin && (
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "15px" }}>➕ Add New Sport</h3>
          <form onSubmit={handleAddSport}>
            <input
              type="text"
              placeholder="Sport Name *"
              value={newSport.name}
              onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
              style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
              required
            />
            <textarea
              placeholder="Description *"
              value={newSport.description}
              onChange={(e) => setNewSport({ ...newSport, description: e.target.value })}
              style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff", minHeight: "80px" }}
              required
            />
            <input
              type="number"
              placeholder="Price (EGP) *"
              value={newSport.price}
              onChange={(e) => setNewSport({ ...newSport, price: e.target.value })}
              style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
              required
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newSport.image}
              onChange={(e) => setNewSport({ ...newSport, image: e.target.value })}
              style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" style={{ background: "#10b981", color: "#fff", padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer" }}>✅ Add Sport</button>
              <button type="button" onClick={() => setShowAddSport(false)} style={{ background: "#ef4444", color: "#fff", padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showAddCoach && selectedSportForCoach && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", maxWidth: "500px", width: "90%", maxHeight: "80%", overflow: "auto" }}>
            <h3>➕ Add Coach to {selectedSportForCoach.name}</h3>
            <input
              type="text"
              placeholder="Coach Name *"
              value={newCoach.name}
              onChange={(e) => setNewCoach({ ...newCoach, name: e.target.value })}
              style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
            />
            {newCoach.schedule.map((dayItem, idx) => (
              <div key={idx} style={{ marginBottom: "15px", padding: "10px", background: "#0f172a", borderRadius: "8px" }}>
                <input
                  type="text"
                  placeholder="Day (e.g., Monday, Tuesday)"
                  value={dayItem.day}
                  onChange={(e) => updateScheduleDay(idx, "day", e.target.value)}
                  style={{ width: "100%", padding: "8px", margin: "5px 0", borderRadius: "6px", border: "1px solid #334155", background: "#1e293b", color: "#fff" }}
                />
                <div>
                  {dayItem.times.map((time, timeIdx) => (
                    <input
                      key={timeIdx}
                      type="text"
                      placeholder="Time (e.g., 10:00 AM)"
                      value={time}
                      onChange={(e) => updateTime(idx, timeIdx, e.target.value)}
                      style={{ width: "calc(100% - 30px)", padding: "8px", margin: "5px 5px 5px 0", borderRadius: "6px", border: "1px solid #334155", background: "#1e293b", color: "#fff" }}
                    />
                  ))}
                  <button onClick={() => addTimeToDay(idx)} style={{ background: "#3b82f6", color: "#fff", padding: "5px 10px", borderRadius: "6px", border: "none", cursor: "pointer", marginTop: "5px" }}>+ Add Time</button>
                </div>
              </div>
            ))}
            <button onClick={addScheduleDay} style={{ background: "#8b5cf6", color: "#fff", padding: "8px 15px", borderRadius: "6px", border: "none", cursor: "pointer", marginRight: "10px" }}>+ Add Day</button>
            <button onClick={() => handleAddCoach(selectedSportForCoach._id)} style={{ background: "#10b981", color: "#fff", padding: "8px 15px", borderRadius: "6px", border: "none", cursor: "pointer" }}>Save Coach</button>
            <button onClick={() => { setShowAddCoach(false); setSelectedSportForCoach(null); }} style={{ background: "#ef4444", color: "#fff", padding: "8px 15px", borderRadius: "6px", border: "none", cursor: "pointer", marginLeft: "10px" }}>Cancel</button>
          </div>
        </div>
      )}

      {filteredSports.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>No sports found. {showOnlyWishlist ? "Add some sports to your wishlist!" : isAdmin ? "Click 'Add New Sport' to create one!" : "Try searching for something else."}</p>
        </div>
      )}

      <div className="grid-3">
        {filteredSports.map((s) => (
          <div
            key={s._id}
            style={{ 
              background: "#1e293b", 
              padding: "15px", 
              borderRadius: "12px",
              transition: "transform 0.3s",
              position: "relative"
            }}
          >
            {isAdmin && (
              <button
                onClick={() => handleDeleteSport(s._id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  zIndex: 10
                }}
              >
                ✕
              </button>
            )}

            <img
              src={s.image || "https://via.placeholder.com/300x180?text=Sport"}
              alt={s.name}
              style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px" }}
            />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
              <h2 style={{ margin: 0 }}>{s.name}</h2>
              <button
                onClick={() => toggleWishlist(s._id)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: wishlist.includes(s._id) ? "#fbbf24" : "#64748b"
                }}
              >
                {wishlist.includes(s._id) ? "⭐" : "☆"}
              </button>
            </div>
            
            <p style={{ color: "#cbd5e1", marginTop: "5px" }}>{s.description}</p>
            <p style={{ fontWeight: "bold", color: "#fbbf24", fontSize: "18px" }}>💰 {s.price} EGP</p>
            
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "15px" }}>
              <button
                onClick={() => quickBook(s)}
                style={{ 
                  background: "#22c55e", 
                  color: "#fff", 
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  flex: 1
                }}
              >
                🚀 Book Now
              </button>
              <button
                onClick={() => setSelectedSport(s)}
                style={{ 
                  background: "#3b82f6", 
                  color: "#fff", 
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  flex: 1
                }}
              >
                📋 Details
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {s.coaches && s.coaches.length > 0 && (
                <button
                  onClick={() => handleToggleCoaches(s._id)}
                  style={{ 
                    background: "#8b5cf6", 
                    color: "#fff", 
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    flex: 1
                  }}
                >
                  👨‍🏫 Coaches ({s.coaches.length})
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => {
                    setSelectedSportForCoach(s);
                    setShowAddCoach(true);
                  }}
                  style={{ 
                    background: "#10b981", 
                    color: "#fff", 
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    flex: 1
                  }}
                >
                  👨‍🏫 + Add Coach
                </button>
              )}
              <button
                onClick={() => shareSport(s)}
                style={{ 
                  background: "#ec4899", 
                  color: "#fff", 
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  flex: 1
                }}
              >
                📤 Share
              </button>
            </div>

            {openSportId === s._id && (
              <div style={{ marginTop: "15px", borderTop: "1px solid #334155", paddingTop: "15px" }}>
                <h3 style={{ color: "#fbbf24", marginBottom: "10px" }}>👨‍🏫 Coaches List</h3>
                {loadingCounts && <p>Loading availability...</p>}
                {s.coaches?.map((c, i) => (
                  <div key={i} style={{ marginBottom: "15px", background: "#0f172a", padding: "10px", borderRadius: "8px" }}>
                    <p style={{ fontWeight: "bold", color: "#60a5fa" }}>{c.name}</p>
                    {c.schedule.map((d, j) => (
                      <div key={j} style={{ marginLeft: "15px", marginTop: "8px" }}>
                        <p style={{ color: "#94a3b8" }}>📅 {d.day}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                          {d.times.map((t, k) => {
                            const key = `${s._id}|${c.name}|${d.day}|${t}`;
                            const booked = counts[key] ?? 0;
                            const remaining = MAX - booked;
                            return (
                              <button
                                key={k}
                                disabled={remaining <= 0}
                                onClick={() => join(s, c.name, d.day, t)}
                                style={{
                                  background: remaining <= 0 ? "#475569" : "#22c55e",
                                  color: "#fff",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  border: "none",
                                  cursor: remaining <= 0 ? "not-allowed" : "pointer",
                                  fontSize: "12px"
                                }}
                              >
                                {t} ({remaining > 0 ? `${remaining} left` : "Full"})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedSport && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
          onClick={() => setSelectedSport(null)}
        >
          <div
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "16px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80%",
              overflow: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0 }}>{selectedSport.name}</h2>
              <button onClick={() => setSelectedSport(null)} style={{ background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer" }}>✕</button>
            </div>
            <img
              src={selectedSport.image || "https://via.placeholder.com/400x200?text=Sport"}
              alt={selectedSport.name}
              style={{ width: "100%", borderRadius: "8px", marginBottom: "15px" }}
            />
            <p><strong>Description:</strong> {selectedSport.description}</p>
            <p><strong>Price:</strong> 🏷️ {selectedSport.price} EGP</p>
            <p><strong>Coaches:</strong> {selectedSport.coaches?.length || 0} coaches available</p>
            <button
              onClick={() => {
                setSelectedSport(null);
                quickBook(selectedSport);
              }}
              style={{
                background: "#22c55e",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                width: "100%",
                marginTop: "15px"
              }}
            >
              🚀 Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}