import React from "react";
import { ArrowUp } from "lucide-react";

const AvailableLandTable = () => {
  return (
    <div
      style={{
        backgroundColor: "#181c3a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #222654, #1b1f45)",
          borderRadius: "12px",
          padding: "20px 24px",
          width: "340px",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h6
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              margin: 0,
              letterSpacing: "0.5px",
            }}
          >
            LAND AREA DISTRIBUTION
          </h6>
          <span
            style={{
              color: "#888",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            ⚙️
          </span>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "14px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            paddingBottom: "10px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
              Total Project Area
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>
              114,357.35 Acres
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
              Available Area
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>
              52,116.64 Acres
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
              Unavailable Area
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>
              62,240.71 Acres
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "6px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "4px",
            marginTop: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "45.5%",
              height: "100%",
              background: "#00c46a",
              borderRadius: "4px",
              transition: "width 0.3s ease",
            }}
          ></div>
        </div>

        {/* Footer Text */}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            fontSize: "0.85rem",
          }}
        >
          <div
            style={{
              background: "#1e537f",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "8px",
            }}
          >
            <ArrowUp size={14} color="#fff" />
          </div>
          <span>
            <strong>45.5%</strong> of Land is available
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvailableLandTable;
