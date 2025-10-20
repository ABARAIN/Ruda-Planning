import React from "react";
import { Row, Col, ProgressBar } from "react-bootstrap";
import { ArrowUp, ArrowDown, Plus } from "lucide-react";

const FirmsTable = () => {
  return (
    <div>
      <h2>Firms Table</h2>
      {/* 3️⃣ RANDOM VALUES */}
      <Col lg={6} xl={4} xs={12}>
        <div
          style={{
            background: "rgba(23,25,59,0.6)",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(6px)",
            color: "#fff",
          }}
        >
          <h6 style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>
            RANDOM VALUES
          </h6>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
              fontSize: "0.85rem",
            }}
          >
            <div>
              <div>Overcome T.</div>
              <div style={{ opacity: 0.8 }}>104.85%</div>
            </div>
            <div>
              <div>Takeoff Angle</div>
              <div style={{ opacity: 0.8 }}>14.29°</div>
            </div>
            <div>
              <div>World Pop.</div>
              <div style={{ opacity: 0.8 }}>7,211M</div>
            </div>
          </div>

          <ProgressBar
            now={60}
            variant="primary"
            style={{
              height: "6px",
              marginTop: "12px",
              background: "rgba(255,255,255,0.1)",
            }}
          />

          <p
            style={{
              marginTop: "8px",
              fontSize: "0.8rem",
              color: "#aaa",
            }}
          >
            <span
              style={{
                background: "#1e537f",
                borderRadius: "50%",
                padding: "3px 6px",
                marginRight: "6px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={12} color="#fff" />
            </span>
            <span style={{ color: "#fff" }}>8,734 higher than last month</span>
          </p>
        </div>
      </Col>
    </div>
  );
};

export default FirmsTable;
