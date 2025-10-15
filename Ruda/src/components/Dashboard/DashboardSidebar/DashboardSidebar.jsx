import React from "react";

const DashboardSidebar = () => {
  return (
    <div
      style={{
        width: "15%",
        height: "100vh",
        background: "transparent",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
      }}
    >
      <h4>RUDA</h4>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        <li style={{ margin: "10px 0" }}>Home</li>
        <li style={{ margin: "10px 0" }}>Projects</li>
        <li style={{ margin: "10px 0" }}>Settings</li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
