import React from "react";
import { Row, Col, ProgressBar } from "react-bootstrap";
import { ArrowUp, ArrowDown, Plus } from "lucide-react";

const FinancialProgress = () => {
  return (
    <div>
      <h2>Financial Progress</h2>
      {/* 2️⃣ TRAFFIC VALUES (you can repurpose this for something else later) */}
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
            TRAFFIC VALUES
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
              <div>Overall Values</div>
              <div style={{ opacity: 0.8 }}>17,567,318</div>
            </div>
            <div>
              <div>Monthly</div>
              <div style={{ opacity: 0.8 }}>55,120</div>
            </div>
            <div>
              <div>24h</div>
              <div style={{ opacity: 0.8 }}>9,695</div>
            </div>
          </div>

          <ProgressBar
            now={60}
            variant="danger"
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
                background: "#7f1e1e",
                borderRadius: "50%",
                padding: "3px 6px",
                marginRight: "6px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowDown size={12} color="#fff" />
            </span>
            <span style={{ color: "#fff" }}>8% lower than last month</span>
          </p>
        </div>
      </Col>
    </div>
  );
};

export default FinancialProgress;
