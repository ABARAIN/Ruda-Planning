import React from "react";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import DashboardHeader from "./DashboardHeader/DashboardHeader";
import DashboardLayout from "./DashboardLayout/DashboardLayout";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div
      className="dashboard-container"
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        background:
          "radial-gradient(farthest-side ellipse at 10% 0, #333867 20%, #17193b)",
      }}
    >
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Right section (Header + Layout) */}
      <div style={{ display: "flex", flexDirection: "column", width: "85%" }}>
        <DashboardHeader />
        <DashboardLayout />
      </div>
    </div>
  );
};

export default Dashboard;
