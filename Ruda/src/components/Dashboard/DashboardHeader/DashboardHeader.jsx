import React from "react";

const DashboardHeader = () => {
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
      }}
    >
      <h2 style={{ margin: 0 }}>Dashboard</h2>
      <div>
        <button style={{ marginRight: "10px" }}>Notifications</button>
        <button>Profile</button>
      </div>
    </div>
  );
};

export default DashboardHeader;
