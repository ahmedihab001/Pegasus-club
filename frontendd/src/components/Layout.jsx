import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AIAssistant from "./AIAssistant/AIAssistant";
import { useState, useEffect } from "react";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Custom event for search
    window.dispatchEvent(new CustomEvent('globalSearch', { detail: searchTerm }));
  };

  return (
    <div className={`app-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"} ${isMobile ? "mobile" : ""}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      <div className="main">
       

        {/* Mobile Search */}
        {isMobile && (
          <div style={{ marginBottom: "15px" }}>
            <button
              onClick={() => setShowSearch(!showSearch)}
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(59,130,246,0.2))",
                border: "1px solid #a855f7",
                borderRadius: "30px",
                padding: "10px 20px",
                fontSize: "14px",
                width: "100%",
                cursor: "pointer"
              }}
            >
              {showSearch ? "✕ Close" : "🔍 Search"}
            </button>
            {showSearch && (
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                style={{
                  width: "100%",
                  padding: "12px 18px",
                  borderRadius: "30px",
                  border: "1px solid rgba(168,85,247,0.3)",
                  background: "rgba(15,23,42,0.8)",
                  color: "#fff",
                  marginTop: "10px"
                }}
              />
            )}
          </div>
        )}

        <Outlet />
      </div>
      <AIAssistant />
    </div>
  );
}