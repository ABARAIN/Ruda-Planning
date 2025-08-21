import React, { useState, useEffect } from "react";
import LogManager from "../LogManager";

// Old RUDA Gantt CSS for exact match to legacy design
const styles = `
.ruda-container {
  width: 100vw;
  height: 100vh;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #f4f6fa;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.ruda-header-container {
  width: 100%;
  background: #1e3a5f;
  color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 0 16px;
  min-height: 48px;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 0.5px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.08);
}

.ruda-title {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  letter-spacing: 0.5px;
}

.ruda-home-button {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  padding: 0 8px;
  transition: background 0.2s;
  border-radius: 3px;
  position: relative;
  top: 0;
  right: 0;
}
.ruda-home-button:hover {
  background: rgba(255,255,255,0.12);
}

.ruda-content {
  flex: 1;
  overflow: auto;
  background: #fff;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  padding: 0;
}

.ruda-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  min-width: 1600px;
  background: #fff;
  font-size: 13px;
  box-shadow: none;
}
.ruda-table th, .ruda-table td {
  border: 1px solid #2c4c6b6f;
  text-align: left;
  padding: 6px 10px;
  font-size: 13px;
  white-space: nowrap;
  height: 32px;
}
.ruda-table th {
  background: #1e3a5f;
  color: #fff;
  font-weight: bold;
  font-size: 13px;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid #1e3a5f;
}
.ruda-fy-header {
  background: #1e3a5f !important;
  color: #fff !important;
  text-align: center;
  font-weight: bold;
  font-size: 13px;
  padding: 6px 0 !important;
  border-bottom: 2px solid #1e3a5f;
}
.ruda-month-header {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 2px 1px !important;
  font-size: 11px;
  min-width: 18px;
  max-width: 18px;
  height: 60px;
  color: #1e3a5f;
  background: #e9eef6;
  border-bottom: 1px solid #d1d5db;
}
.ruda-phase-row {
  background: #444d5c;
  color: #fff;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
}
.ruda-phase-row:hover {
  background: #2d3646;
}
.ruda-phase-header {
  background: #444d5c !important;
  color: #fff !important;
  font-weight: bold;
  font-size: 15px;
  padding: 8px 10px !important;
}
.ruda-package-row {
  background: #f7fafd;
  font-weight: bold;
  color: #1e3a5f;
  font-size: 14px;
  cursor: pointer;
}
.ruda-package-row:hover {
  background: #e9eef6;
}
.ruda-item-row {
  background: #fff;
  color: #222;
  font-size: 13px;
  cursor: pointer;
}
.ruda-item-row:hover {
  background: #f2f6fa;
}
.ruda-selected-row {
  background: #1976d2 !important;
  color: #fff !important;
}
.ruda-selected-row:hover {
  background: #1251a3 !important;
}
.right {
  text-align: right;
}
.ruda-timeline-cell {
  width: 18px;
  height: 28px;
  text-align: center;
  padding: 0 !important;
  font-size: 11px;
  position: relative;
  background: #fff;
  border: 1px solid #e0e4ea;
}
.ruda-timeline-active {
  // background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  background: #4caf50;
  paddingtop: 10px !important;
  border: 1px solid #4caf50 !important;
  color: transparent;
  box-shadow: 0 0 0 1px #4caf50 inset;
}
.ruda-timeline-inactive {
  background: #fff;
}
/* Remove extra row types for clarity, keep only item/package/phase */
/* Hide scrollbars for a cleaner look */
.ruda-content::-webkit-scrollbar {
  width: 8px;
  background: #e9eef6;
}
.ruda-content::-webkit-scrollbar-thumb {
  background: #c5d0e6;
  border-radius: 4px;
}
body {
  margin: 0;
  padding: 0;
}
`;

const RUDADevelopmentPlan = () => {
  const [expandedPhases, setExpandedPhases] = useState(new Set([0]));
  const [expandedPackages, setExpandedPackages] = useState(new Set());
  const [expandedSubpackages, setExpandedSubpackages] = useState(new Set());
  const [expandedSubsubpackages, setExpandedSubsubpackages] = useState(
    new Set()
  );
  const [expandedReaches, setExpandedReaches] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchGanttData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/ganttcrud");
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          console.error("Failed to fetch Gantt data:", result.error);
          // Fallback to empty array if API fails
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching Gantt data:", error);
        // Fallback to empty array if API fails
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGanttData();
  }, []);

  const months = [
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ];

  const togglePhase = (phaseIndex) => {
    const newSet = new Set(expandedPhases);
    newSet.has(phaseIndex) ? newSet.delete(phaseIndex) : newSet.add(phaseIndex);
    setExpandedPhases(newSet);
  };

  const togglePackage = (packageKey) => {
    const newSet = new Set(expandedPackages);
    newSet.has(packageKey) ? newSet.delete(packageKey) : newSet.add(packageKey);
    setExpandedPackages(newSet);
  };

  const toggleSubpackage = (subpackageKey) => {
    const newSet = new Set(expandedSubpackages);
    newSet.has(subpackageKey)
      ? newSet.delete(subpackageKey)
      : newSet.add(subpackageKey);
    setExpandedSubpackages(newSet);
  };

  const toggleSubsubpackage = (subsubpackageKey) => {
    const newSet = new Set(expandedSubsubpackages);
    newSet.has(subsubpackageKey)
      ? newSet.delete(subsubpackageKey)
      : newSet.add(subsubpackageKey);
    setExpandedSubsubpackages(newSet);
  };

  const toggleReach = (reachKey) => {
    const newSet = new Set(expandedReaches);
    newSet.has(reachKey) ? newSet.delete(reachKey) : newSet.add(reachKey);
    setExpandedReaches(newSet);
  };

  const handleItemClick = async (item, type = "item") => {
    // Only set timeline for leaf items that have timeline data
    if (item.timeline && Array.isArray(item.timeline)) {
      setSelectedItem(item);

      // Log the view action for demonstration
      try {
        await fetch("http://localhost:5000/api/ganttcrud/log-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId: item.name?.replace(/\s+/g, "-").toLowerCase() || "unknown",
            itemName: item.name || "Unknown Item",
            action: "VIEW",
          }),
        });
      } catch (error) {
        console.error("Failed to log item view:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="ruda-container">
        <style>{styles}</style>
        <div className="ruda-header-container">
          <h1 className="ruda-title">RUDA DEVELOPMENT PLAN - TIMELINE</h1>
          <div className="ruda-home-button">HOME</div>
        </div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          Loading Gantt data...
        </div>
      </div>
    );
  }

  return (
    <div className="ruda-container">
      <style>{styles}</style>
      <div className="ruda-header-container">
        <h1 className="ruda-title">RUDA DEVELOPMENT PLAN - TIMELINE</h1>
        <div className="ruda-home-button" onClick={() => setShowLog(true)}>
          HOME
        </div>
      </div>
      <div className="ruda-content">
        <table className="ruda-table">
          <thead>
            <tr>
              <th
                style={{
                  minWidth: "300px",
                  maxWidth: "300px",
                  width: "300px",
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                rowSpan={2}
              >
                PHASES / PACKAGES
              </th>
              <th
                style={{ minWidth: "80px", width: "80px", textAlign: "center" }}
                rowSpan={2}
              >
                Amount <br /> (PKR, M)
              </th>
              <th
                style={{ minWidth: "80px", width: "80px", textAlign: "center" }}
                rowSpan={2}
              >
                Duration <br /> (Days)
              </th>
              <th
                style={{ minWidth: "80px", width: "80px", textAlign: "center" }}
                rowSpan={2}
              >
                Schedule <br /> %
              </th>
              <th
                style={{ minWidth: "80px", width: "80px", textAlign: "center" }}
                rowSpan={2}
              >
                Performance <br /> %
              </th>
              <th
                style={{ minWidth: "80px", width: "80px", textAlign: "center" }}
                rowSpan={2}
              >
                Planned Value <br /> (PKR, M)
              </th>
              <th
                style={{ minWidth: "80px", width: "80px", textAlign: "center" }}
                rowSpan={2}
              >
                Earned Value <br /> (PKR, M)
              </th>
              <th
                style={{ minWidth: "80px", width: "80px", textAlign: "center" }}
                rowSpan={2}
              >
                Actual <br /> Start
              </th>
              <th
                style={{ minWidth: "80px", width: "80px", textAlign: "center" }}
                rowSpan={2}
              >
                Actual <br /> Finish
              </th>
              <th colSpan={12} className="ruda-fy-header">
                FY 25-26
              </th>
              <th colSpan={12} className="ruda-fy-header">
                FY 26-27
              </th>
            </tr>
            <tr>
              {months.map((month, index) => (
                <th
                  key={index}
                  className="ruda-month-header"
                  style={{
                    textAlign: "center",
                    whiteSpace: "nowrap", // ✅ Prevent vertical stacking
                  }}
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((phase, phaseIndex) => (
              <React.Fragment key={phaseIndex}>
                <tr
                  className="ruda-phase-row"
                  onClick={() => togglePhase(phaseIndex)}
                >
                  <td
                    className="ruda-phase-header"
                    style={{
                      minWidth: "300px",
                      maxWidth: "300px",
                      width: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {phase.phase} {expandedPhases.has(phaseIndex) ? "▲" : "▼"}
                  </td>
                  <td className="ruda-phase-header right">{phase.amount}</td>
                  <td className="ruda-phase-header right">-</td>
                  <td className="ruda-phase-header right">-</td>
                  <td className="ruda-phase-header right">-</td>
                  <td className="ruda-phase-header right">-</td>
                  <td className="ruda-phase-header right">-</td>
                  <td className="ruda-phase-header right">-</td>
                  <td className="ruda-phase-header right">-</td>
                  {months.map((_, monthIndex) => (
                    <td key={monthIndex} className="ruda-phase-header"></td>
                  ))}
                </tr>
                {expandedPhases.has(phaseIndex) && (
                  <>
                    {/* Render simple items (Phase 1 style) */}
                    {phase.items &&
                      phase.items.map((item, itemIndex) => (
                        <tr
                          key={`item-${itemIndex}`}
                          className={`ruda-item-row ${
                            selectedItem === item ? "ruda-selected-row" : ""
                          }`}
                          onClick={() => handleItemClick(item, "item")}
                        >
                          <td
                            style={{
                              paddingLeft: "20px",
                              minWidth: "300px",
                              maxWidth: "300px",
                              width: "300px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.name}
                          </td>
                          <td className="right">{item.amount}</td>
                          <td className="right">-</td>
                          <td className="right">-</td>
                          <td className="right">-</td>
                          <td className="right">-</td>
                          <td className="right">-</td>
                          <td className="right">-</td>
                          <td className="right">-</td>
                          {item.timeline.map((value, timeIndex) => (
                            <td
                              key={timeIndex}
                              className={`ruda-timeline-cell ${
                                value === 1
                                  ? "ruda-timeline-active"
                                  : "ruda-timeline-inactive"
                              }`}
                            ></td>
                          ))}
                        </tr>
                      ))}

                    {/* Render packages (Phase 2+ style) */}
                    {phase.packages &&
                      phase.packages.map((pkg, packageIndex) => {
                        const packageKey = `${phaseIndex}-${packageIndex}`;
                        return (
                          <React.Fragment key={packageKey}>
                            <tr
                              className={`ruda-package-row ${
                                selectedItem === pkg ? "ruda-selected-row" : ""
                              }`}
                              onClick={() => {
                                togglePackage(packageKey);
                                handleItemClick(pkg, "package");
                              }}
                            >
                              <td
                                style={{
                                  paddingLeft: "20px",
                                  minWidth: "300px",
                                  maxWidth: "300px",
                                  width: "300px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {pkg.name}{" "}
                                {expandedPackages.has(packageKey) ? "▲" : "▼"}
                              </td>
                              <td className="right">{pkg.budgetedCost}</td>
                              <td className="right">????</td>
                              <td className="right">{pkg.scheduleComplete}</td>
                              <td className="right">
                                {pkg.performanceComplete}
                              </td>
                              <td className="right">{pkg.plannedValue}</td>
                              <td className="right">{pkg.earnedValue}</td>
                              <td className="right">{pkg.actualStart}</td>
                              <td className="right">{pkg.actualFinish}</td>
                              {pkg.timeline.map((value, timeIndex) => (
                                <td
                                  key={timeIndex}
                                  className={`ruda-timeline-cell ${
                                    value === 1
                                      ? "ruda-timeline-active"
                                      : "ruda-timeline-inactive"
                                  }`}
                                ></td>
                              ))}
                            </tr>
                            {expandedPackages.has(packageKey) &&
                              pkg.subpackages &&
                              pkg.subpackages.map((subpkg, subpackageIndex) => {
                                const subpackageKey = `${packageKey}-${subpackageIndex}`;
                                return (
                                  <React.Fragment key={subpackageKey}>
                                    <tr
                                      className={`ruda-subpackage-row ${
                                        selectedItem === subpkg
                                          ? "ruda-selected-row"
                                          : ""
                                      }`}
                                      onClick={() => {
                                        toggleSubpackage(subpackageKey);
                                        handleItemClick(subpkg, "subpackage");
                                      }}
                                    >
                                      <td
                                        style={{
                                          paddingLeft: "40px",
                                          minWidth: "300px",
                                          maxWidth: "300px",
                                          width: "300px",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {subpkg.name}{" "}
                                        {expandedSubpackages.has(subpackageKey)
                                          ? "▲"
                                          : "▼"}
                                      </td>
                                      <td className="right">
                                        {subpkg.budgetedCost}
                                      </td>
                                      <td className="right">
                                        {subpkg.duration}
                                      </td>
                                      <td className="right">
                                        {subpkg.scheduleComplete}
                                      </td>
                                      <td className="right">
                                        {subpkg.performanceComplete}
                                      </td>
                                      <td className="right">
                                        {subpkg.plannedValue}
                                      </td>
                                      <td className="right">
                                        {subpkg.earnedValue}
                                      </td>
                                      <td className="right">
                                        {subpkg.actualStart}
                                      </td>
                                      <td className="right">
                                        {subpkg.actualFinish}
                                      </td>
                                      {subpkg.timeline.map(
                                        (value, timeIndex) => (
                                          <td
                                            key={timeIndex}
                                            className={`ruda-timeline-cell ${
                                              value === 1
                                                ? "ruda-timeline-active"
                                                : "ruda-timeline-inactive"
                                            }`}
                                          ></td>
                                        )
                                      )}
                                    </tr>
                                    {expandedSubpackages.has(subpackageKey) && (
                                      <>
                                        {/* Render subsubpackages */}
                                        {subpkg.subsubpackages &&
                                          subpkg.subsubpackages.map(
                                            (subsubpkg, subsubpackageIndex) => {
                                              const subsubpackageKey = `${subpackageKey}-${subsubpackageIndex}`;
                                              return (
                                                <React.Fragment
                                                  key={subsubpackageKey}
                                                >
                                                  <tr
                                                    className={`ruda-subsubpackage-row ${
                                                      selectedItem === subsubpkg
                                                        ? "ruda-selected-row"
                                                        : ""
                                                    }`}
                                                    onClick={() => {
                                                      toggleSubsubpackage(
                                                        subsubpackageKey
                                                      );
                                                      handleItemClick(
                                                        subsubpkg,
                                                        "subsubpackage"
                                                      );
                                                    }}
                                                  >
                                                    <td
                                                      style={{
                                                        paddingLeft: "60px",
                                                        minWidth: "300px",
                                                        maxWidth: "300px",
                                                        width: "300px",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                          "ellipsis",
                                                        whiteSpace: "nowrap",
                                                      }}
                                                    >
                                                      {subsubpkg.name}{" "}
                                                      {expandedSubsubpackages.has(
                                                        subsubpackageKey
                                                      )
                                                        ? "▲"
                                                        : "▼"}
                                                    </td>
                                                    <td className="right">
                                                      {subsubpkg.budgetedCost}
                                                    </td>
                                                    <td className="right">
                                                      {subsubpkg.duration}
                                                    </td>
                                                    <td className="right">
                                                      {
                                                        subsubpkg.scheduleComplete
                                                      }
                                                    </td>
                                                    <td className="right">
                                                      {
                                                        subsubpkg.performanceComplete
                                                      }
                                                    </td>
                                                    <td className="right">
                                                      {subsubpkg.plannedValue}
                                                    </td>
                                                    <td className="right">
                                                      {subsubpkg.earnedValue}
                                                    </td>
                                                    <td className="right">
                                                      {subsubpkg.actualStart}
                                                    </td>
                                                    <td className="right">
                                                      {subsubpkg.actualFinish}
                                                    </td>
                                                    {subsubpkg.timeline.map(
                                                      (value, timeIndex) => (
                                                        <td
                                                          key={timeIndex}
                                                          className={`ruda-timeline-cell ${
                                                            value === 1
                                                              ? "ruda-timeline-active"
                                                              : "ruda-timeline-inactive"
                                                          }`}
                                                        ></td>
                                                      )
                                                    )}
                                                  </tr>
                                                  {expandedSubsubpackages.has(
                                                    subsubpackageKey
                                                  ) &&
                                                    subsubpkg.activities &&
                                                    subsubpkg.activities.map(
                                                      (
                                                        activity,
                                                        activityIndex
                                                      ) => (
                                                        <tr
                                                          key={`${subsubpackageKey}-activity-${activityIndex}`}
                                                          className={`ruda-activity-row ${
                                                            selectedItem ===
                                                            activity
                                                              ? "ruda-selected-row"
                                                              : ""
                                                          }`}
                                                          onClick={() =>
                                                            handleItemClick(
                                                              activity,
                                                              "activity"
                                                            )
                                                          }
                                                        >
                                                          <td
                                                            style={{
                                                              paddingLeft:
                                                                "80px",
                                                              minWidth: "300px",
                                                              maxWidth: "300px",
                                                              width: "300px",
                                                              overflow:
                                                                "hidden",
                                                              textOverflow:
                                                                "ellipsis",
                                                              whiteSpace:
                                                                "nowrap",
                                                            }}
                                                          >
                                                            {activity.name}
                                                          </td>
                                                          <td className="right">
                                                            {
                                                              activity.plannedValue
                                                            }
                                                          </td>
                                                          <td className="right">
                                                            {activity.duration}
                                                          </td>
                                                          <td className="right">
                                                            {
                                                              activity.scheduleComplete
                                                            }
                                                          </td>
                                                          <td className="right">
                                                            {
                                                              activity.performanceComplete
                                                            }
                                                          </td>
                                                          <td className="right">
                                                            {
                                                              activity.plannedValue
                                                            }
                                                          </td>
                                                          <td className="right">
                                                            {
                                                              activity.earnedValue
                                                            }
                                                          </td>
                                                          <td className="right">
                                                            {
                                                              activity.actualStart
                                                            }
                                                          </td>
                                                          <td className="right">
                                                            {
                                                              activity.actualFinish
                                                            }
                                                          </td>
                                                          {activity.timeline.map(
                                                            (
                                                              value,
                                                              timeIndex
                                                            ) => (
                                                              <td
                                                                key={timeIndex}
                                                                className={`ruda-timeline-cell ${
                                                                  value === 1
                                                                    ? "ruda-timeline-active"
                                                                    : "ruda-timeline-inactive"
                                                                }`}
                                                              ></td>
                                                            )
                                                          )}
                                                        </tr>
                                                      )
                                                    )}
                                                </React.Fragment>
                                              );
                                            }
                                          )}

                                        {/* Render direct activities of subpackage */}
                                        {subpkg.activities &&
                                          subpkg.activities.map(
                                            (activity, activityIndex) => (
                                              <tr
                                                key={`${subpackageKey}-activity-${activityIndex}`}
                                                className={`ruda-activity-row ${
                                                  selectedItem === activity
                                                    ? "ruda-selected-row"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  handleItemClick(
                                                    activity,
                                                    "activity"
                                                  )
                                                }
                                              >
                                                <td
                                                  style={{
                                                    paddingLeft: "60px",
                                                    minWidth: "300px",
                                                    maxWidth: "300px",
                                                    width: "300px",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  {activity.name}
                                                </td>
                                                <td className="right">
                                                  {activity.plannedValue}
                                                </td>
                                                {activity.timeline.map(
                                                  (value, timeIndex) => (
                                                    <td
                                                      key={timeIndex}
                                                      className={`ruda-timeline-cell ${
                                                        value === 1
                                                          ? "ruda-timeline-active"
                                                          : "ruda-timeline-inactive"
                                                      }`}
                                                    ></td>
                                                  )
                                                )}
                                              </tr>
                                            )
                                          )}
                                      </>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                          </React.Fragment>
                        );
                      })}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {showLog && (
        <LogManager logType="gantt" onClose={() => setShowLog(false)} />
      )}
    </div>
  );
};

export default RUDADevelopmentPlan;
