import React from "react";
import { MapPin, Settings, Search } from "lucide-react";

const RudaStatistics = () => {
  const stats = [
    {
      title: "Priority Projects",
      desc: "Progress Update of Priority Projects",
      color: "#2196f3",
      progress: 20,
    },
    {
      title: "Ongoing Projects",
      desc: "Progress Update of Ongoing Projects",
      color: "#f44336",
      progress: 70,
    },
    {
      title: "Completed Projects",
      desc: "Progress Update of PCompleted Projects",
      color: "#4caf50",
      progress: 10,
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        color: "#ccc",
        padding: "16px",
        fontFamily: '"Open Sans", sans-serif',
        display: "flex",
        flexDirection: "column",
        fontSize: "0.85rem",
      }}
    >
      {/* 🔹 Header */}
      <div>
        <h3
          style={{ fontSize: "1.2rem", marginBottom: "8px", fontWeight: "400" }}
        >
          Ruda{" "}
          <span style={{ color: "#ccc", fontWeight: "bold" }}>Statistics</span>
        </h3>

        <p style={{ marginBottom: "10px" }}>Status: Live</p>

        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            margin: 0,
          }}
        >
          <MapPin size={16} />
          Ruda, Lahore, Pakistan
        </p>
      </div>

      {/* 🔹 Progress Stats */}
      <div style={{ marginTop: "4px" }}>
        {stats.map((item) => (
          <div
            key={item.title}
            style={{
              marginBottom: "5px",
              borderRadius: "8px",
              padding: "10px 0px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <div>
                <h6
                  style={{
                    marginBottom: "4px",
                    fontSize: "0.95rem",
                    fontWeight: "300",
                    color: "#ccc",
                  }}
                >
                  {item.title}
                </h6>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#bbb" }}>
                  {item.desc}
                </p>
              </div>
              <span
                style={{
                  background: "#303563",
                  borderRadius: "6px",
                  padding: "6px 6px",
                  fontSize: "0.75rem",
                  height: "35px",
                }}
              >
                {item.progress}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "4px",
                background: "#2a2a2a",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${item.progress}%`,
                  height: "100%",
                  background: item.color,
                  transition: "width 0.4s ease",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Bottom Info */}
      <div style={{ marginTop: "8px" }}>
        <h6
          style={{ marginBottom: "4px", fontWeight: "400", fontSize: "0.8rem" }}
        >
          Development Budget FY 24-25:{" "}
          <span style={{ color: "#4caf50" }}>15.97 B</span>
        </h6>

        <p style={{ margin: "2px 0" }}>Performance Efficiency: 53%</p>

        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            margin: "2px 0",
          }}
        >
          <Settings size={16} />
          32 Projects in progress, 10 completed
        </p>

        <div
          style={{
            display: "flex",
            marginTop: "8px",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <input
            type="text"
            placeholder="Search Project"
            style={{
              flex: 1,
              background: "transparent",
              border: "1px solid #555",
              padding: "6px 8px",
              color: "#fff",
              outline: "none",
              fontSize: "0.8rem",
              fontFamily: '"Open Sans", sans-serif',
            }}
          />
          <button
            style={{
              background: "#2196f3",
              border: "none",
              color: "#fff",
              padding: "0 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RudaStatistics;
