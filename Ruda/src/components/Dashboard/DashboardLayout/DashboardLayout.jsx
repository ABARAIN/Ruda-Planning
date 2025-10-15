import React from "react";

const DashboardLayout = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 60px)",
        background: "transparent",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <h3>Welcome to the Dashboard</h3>
      <p>This is where your main content will go.</p>
    </div>
  );
};

export default DashboardLayout;
