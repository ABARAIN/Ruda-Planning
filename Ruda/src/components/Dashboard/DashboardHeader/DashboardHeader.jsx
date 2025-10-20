import React, { useState, useRef, useEffect } from "react";
import {
  Settings,
  Layers,
  Power,
  FolderKanban,
  CalendarClock,
  Briefcase,
  BarChart3,
  ActivitySquare,
  Route,
} from "lucide-react";

const DashboardHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // 🔹 Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // 🔹 Layer options (with icons)
  const layerOptions = [
    {
      name: "Ongoing Projects",
      icon: <FolderKanban size={16} />,
      onClick: () => (window.location.href = "/ongoing-projects"),
    },
    {
      name: "Timeline",
      icon: <CalendarClock size={16} />,
      onClick: () => (window.location.href = "/hierarchical-gantt"),
    },
    {
      name: "Portfolio",
      icon: <Briefcase size={16} />,
      onClick: () => (window.location.href = "/portfolio"),
    },
    {
      name: "Summary",
      icon: <BarChart3 size={16} />,
      onClick: () => (window.location.href = "/overall-summary"),
    },
    {
      name: "Progress Update",
      icon: <ActivitySquare size={16} />,
      onClick: () => (window.location.href = "/progress-update"),
    },
    {
      name: "Proposed Roads",
      icon: <Route size={16} />,
      onClick: () =>
        window.dispatchEvent(new CustomEvent("toggleProposedRoads")),
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "relative",
        fontFamily: '"Open Sans", sans-serif',
      }}
    >
      {/* Left: Title */}
      <h2 style={{ margin: 0, fontWeight: 600 }}>Dashboard</h2>

      {/* Right: Icons */}
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        <Settings size={22} style={{ cursor: "pointer" }} title="Settings" />

        <div style={{ position: "relative" }} ref={menuRef}>
          <Layers
            size={22}
            style={{ cursor: "pointer" }}
            title="Layers"
            onClick={() => setShowMenu((prev) => !prev)}
          />

          {/* 🔹 Dropdown Menu */}
          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: "30px",
                right: 0,
                backgroundColor: "#17193b",
                borderRadius: "8px",
                boxShadow: "0 0px 4px 4px #2d327139",
                padding: "8px 0",
                zIndex: 100,
                backdropFilter: "blur(8px)",
                minWidth: "180px",
              }}
            >
              {layerOptions.map((item) => (
                <div
                  key={item.name}
                  onClick={() => {
                    item.onClick();
                    setShowMenu(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px 16px",
                    color: "#fff",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.25)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Power
          size={22}
          color="white"
          style={{
            cursor: "pointer",
            transition: "transform 0.2s ease, color 0.2s ease",
          }}
          title="Logout"
          onClick={handleLogout}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
