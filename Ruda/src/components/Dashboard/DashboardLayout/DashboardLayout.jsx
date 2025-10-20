import React from "react";
import DashboardMap from "./LayoutComponent/DashboardMap";
import RudaStatistics from "./LayoutComponent/RudaStatistics";
import AvailableLandTable from "./LayoutComponent/AvailableLandTable";
import FinancialProgress from "./LayoutComponent/FinancialProgress";
import FirmsTable from "./LayoutComponent/FirmsTable";
import ProgressBrief from "./LayoutComponent/ProgressBrief";
import PriorityProjectsTable from "./LayoutComponent/PriorityProjectsTable";
import OngoingProjectsTable from "./LayoutComponent/OngoingProjectsTable";

const DashboardLayout = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 60px)",
        background: "transparent",
        padding: "20px",
        overflowY: "auto",
        fontFamily: '"Open Sans", sans-serif',
      }}
    >
      {/* 🔹 Top Section: Map + Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr", // Map takes more space
          gap: "20px",
          marginBottom: "20px",
          height: "50vh",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "10px",
            height: "100%",
          }}
        >
          <DashboardMap />
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "10px",
            height: "100%",
          }}
        >
          <RudaStatistics />
        </div>
      </div>

      {/* 🔹 Bottom Section: 6 Boxes (2 Rows × 3 Columns) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, auto)",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "10px",
          }}
        >
          <AvailableLandTable />
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "10px",
          }}
        >
          <FinancialProgress />
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "10px",
          }}
        >
          <FirmsTable />
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "10px",
          }}
        >
          <ProgressBrief />
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "10px",
          }}
        >
          <PriorityProjectsTable />
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "10px",
          }}
        >
          <OngoingProjectsTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
