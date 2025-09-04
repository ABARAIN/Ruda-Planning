import React, { useState, useEffect, useRef } from "react";

export default function OngoingProjects() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({});
  const scrollerRef = useRef(null);

  // Constants for column mapping
  const COL_BREAKDOWN = "Project Amount Breakdown \nDevelopment Works";
  const COL_BUDGET_EST = "Budget Estimates\n(PKR Millions)";
  const COL_ACTUAL_EXP =
    "Actual Expenditure  Upto (14 Feb 2025) (PKR Millions)";
  const COL_ONGOING = "Ongoing / Completed";
  const COL_PRIORITY = "Priority Projects";
  const COL_CHANGE = "Change Record";

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [data, query, filterValue]);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      initializeExpandedCategories();
    }
  }, [data]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/Sheet.json");
      if (!response.ok) throw new Error("Failed to load data");

      const jsonData = await response.json();
      const sheet = jsonData.workbook?.sheets?.[0];

      if (!sheet?.rows) throw new Error("Invalid data structure");

      // Process and filter ongoing projects
      const processedData = processOngoingProjects(sheet.rows);
      setData(processedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processOngoingProjects = (rows) => {
    const ongoingProjects = [];
    let serialNumber = 1;

    rows.forEach((row) => {
      const projectName = row[COL_BREAKDOWN];
      const status = row[COL_ONGOING];

      // Skip if no project name
      if (!projectName) return;

      // Check if this is an ongoing project
      if (status === "Ongoing") {
        const project = {
          serialNumber: serialNumber++,
          projectName: projectName,
          category: categorizeProject(projectName),
          startDate: extractStartDate(row),
          finishDate: extractFinishDate(row),
          valueOfContract: formatValue(row[COL_BUDGET_EST]),
          physicalPlan: calculatePhysicalPlan(),
          physicalActual: calculatePhysicalActual(row),
          paymentsCertified: formatValue(row[COL_ACTUAL_EXP]),
          remarks: row[COL_CHANGE] || "-",
        };

        ongoingProjects.push(project);
      }
    });

    // Group projects by category
    const groupedProjects = {};
    ongoingProjects.forEach((project) => {
      if (!groupedProjects[project.category]) {
        groupedProjects[project.category] = [];
      }
      groupedProjects[project.category].push(project);
    });

    return groupedProjects;
  };

  const categorizeProject = (projectName) => {
    const name = projectName.toLowerCase();

    if (name.includes("rtw") || name.includes("river training")) {
      return "River Training Works";
    }
    if (
      name.includes("feasibility") &&
      (name.includes("design") || name.includes("hydrological"))
    ) {
      return "Feasibility, Design & Hydrological Studies";
    }
    if (
      name.includes("feasibility") &&
      (name.includes("survey") || name.includes("design"))
    ) {
      return "Feasibility, Design & Surveys";
    }
    if (
      name.includes("wwtp") ||
      name.includes("waste water") ||
      name.includes("treatment plant")
    ) {
      return "WWTPs";
    }
    if (
      name.includes("infra") ||
      name.includes("road") ||
      name.includes("bridge") ||
      name.includes("utilities") ||
      name.includes("development")
    ) {
      return "Infrastructure";
    }
    return "Other Projects";
  };

  const extractStartDate = (row) => {
    // Extract start date from FY columns - find first non-null/non-zero value
    const fyColumns = [
      "FY 20-21",
      "FY 21-22",
      "FY 22-23",
      "FY 23-24",
      "FY 24-25",
      "FY 25-26",
    ];

    for (const fy of fyColumns) {
      if (row[fy] && row[fy] > 0) {
        return convertFYToDate(fy, true);
      }
    }
    return "-";
  };

  const extractFinishDate = (row) => {
    // Extract finish date from FY columns - find last non-null/non-zero value
    const fyColumns = [
      "FY 35-36",
      "FY 34-35",
      "FY 33-34",
      "FY 32-33",
      "FY 31-32",
      "FY 30-31",
      "FY 29-30",
      "FY 28-29",
      "FY 27-28",
      "FY 26-27",
      "FY 25-26",
      "FY 24-25",
    ];

    for (const fy of fyColumns) {
      if (row[fy] && row[fy] > 0) {
        return convertFYToDate(fy, false);
      }
    }
    return "-";
  };

  const convertFYToDate = (fy, isStart) => {
    const yearMatch = fy.match(/FY (\d{2})-(\d{2})/);
    if (!yearMatch) return "-";

    const startYear = 2000 + parseInt(yearMatch[1]);
    const endYear = 2000 + parseInt(yearMatch[2]);

    if (isStart) {
      return `01-Jul-${startYear}`;
    } else {
      return `30-Jun-${endYear}`;
    }
  };

  const calculatePhysicalPlan = () => {
    // This would need actual plan data - for now return placeholder
    return Math.floor(Math.random() * 100) + "%";
  };

  const calculatePhysicalActual = (row) => {
    const budget = row[COL_BUDGET_EST];
    const actual = row[COL_ACTUAL_EXP];

    if (budget && actual && budget > 0) {
      const percentage = Math.min(100, Math.round((actual / budget) * 100));
      return percentage + "%";
    }
    return "-";
  };

  const formatValue = (value) => {
    if (!value || value === 0) return "-";
    if (typeof value === "number") {
      return (value / 1000).toFixed(2); // Convert to billions and format
    }
    return "-";
  };

  const applyFilters = () => {
    const filteredGroups = {};

    Object.keys(data).forEach((category) => {
      let categoryProjects = [...data[category]];

      // Apply search filter
      if (query.trim()) {
        const searchTerm = query.toLowerCase();
        categoryProjects = categoryProjects.filter(
          (item) =>
            item.projectName.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.remarks.toLowerCase().includes(searchTerm)
        );
      }

      // Apply dropdown filter
      if (filterValue !== "all") {
        if (category.toLowerCase().includes(filterValue.toLowerCase())) {
          // Keep all projects in this category
        } else {
          categoryProjects = []; // Filter out this entire category
        }
      }

      // Only include categories that have projects after filtering
      if (categoryProjects.length > 0) {
        filteredGroups[category] = categoryProjects;
      }
    });

    setFilteredData(filteredGroups);
  };

  const getUniqueCategories = () => {
    return Object.keys(data).sort();
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const initializeExpandedCategories = () => {
    const categories = Object.keys(data);
    const expanded = {};
    categories.forEach((category) => {
      expanded[category] = true; // All categories expanded by default
    });
    setExpandedCategories(expanded);
  };

  const containerStyle = {
    width: "100%",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    background: "#f5f5f5",
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            fontSize: "16px",
            background: "white",
            margin: "20px",
            borderRadius: "8px",
          }}
        >
          Loading ongoing projects...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            fontSize: "16px",
            background: "white",
            margin: "20px",
            borderRadius: "8px",
            color: "#dc2626",
          }}
        >
          Error: {error}
        </div>
      </div>
    );
  }

  const headerStyle = {
    background: "#2c5282",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const controlsStyle = {
    background: "white",
    padding: "15px 20px",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
  };

  const searchInputStyle = {
    flex: 1,
    maxWidth: "1200px",
    padding: "8px 12px",
    border: "1px solid #cbd5e0",
    borderRadius: "4px",
    fontSize: "14px",
  };

  const selectStyle = {
    padding: "8px 12px",
    border: "1px solid #cbd5e0",
    borderRadius: "4px",
    fontSize: "14px",
    minWidth: "200px",
  };

  const tableContainerStyle = {
    flex: 1,
    overflow: "auto",
    background: "white",
    margin: 0,
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1400px",
  };

  const headerRowStyle = {
    background: "#2c5282",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 10,
  };

  const headerCellStyle = {
    padding: "12px 8px",
    border: "1px solid #357abd",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "12px",
    verticalAlign: "middle",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
            ONGOING DEVELOPMENT PROJECTS
          </h1>
        </div>
        <div>
          <button
            style={{
              background: "#4a90e2",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => (window.location.href = "/")}
          >
            HOME
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={controlsStyle}>
        <input
          type="text"
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={searchInputStyle}
        />
        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Categories</option>
          {getUniqueCategories().map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={tableContainerStyle} ref={scrollerRef}>
        <table style={tableStyle}>
          <thead>
            <tr style={headerRowStyle}>
              <th
                style={{ ...headerCellStyle, width: "80px", minWidth: "80px" }}
              >
                Sr No.
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "300px",
                  minWidth: "300px",
                }}
              >
                Project Name
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "120px",
                  minWidth: "120px",
                }}
              >
                Start Date
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "120px",
                  minWidth: "120px",
                }}
              >
                Finish Date
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "150px",
                  minWidth: "150px",
                }}
              >
                Value of Contract
                <br />
                (in millions)
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "120px",
                  minWidth: "120px",
                }}
              >
                Physical Plan %
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "120px",
                  minWidth: "120px",
                }}
              >
                Physical Actual %
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "150px",
                  minWidth: "150px",
                }}
              >
                Payments Certified
                <br />
                (in millions)
              </th>
              <th
                style={{
                  ...headerCellStyle,
                  width: "200px",
                  minWidth: "200px",
                }}
              >
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(filteredData).length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  No ongoing projects found
                </td>
              </tr>
            ) : (
              Object.keys(filteredData).map((category) => {
                const isExpanded = expandedCategories[category];
                const projects = filteredData[category];

                return (
                  <React.Fragment key={category}>
                    {/* Category Header Row */}
                    <tr
                      style={{
                        background: "#2d3748",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                      onClick={() => toggleCategory(category)}
                    >
                      <td
                        colSpan="9"
                        style={{
                          padding: "12px 15px",
                          border: "1px solid #357abd",
                          fontWeight: "bold",
                          fontSize: "12px",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ marginRight: "10px" }}>
                          {isExpanded ? "▼" : "▶"}
                        </span>
                        {category} ({projects.length} projects)
                      </td>
                    </tr>

                    {/* Project Rows - Only show if expanded */}
                    {isExpanded &&
                      projects.map((project, index) => {
                        const cellStyle = {
                          padding: "10px 8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          fontWeight: "500",
                        };

                        const nameCellStyle = {
                          ...cellStyle,
                          textAlign: "left",
                          paddingLeft: "25px", // Indent sub-projects
                          color: "#4a5568",
                        };

                        return (
                          <tr
                            key={`${category}-${index}`}
                            style={{
                              background: index % 2 === 0 ? "#f7fafc" : "white",
                              borderLeft: "3px solid #cbd5e0",
                            }}
                          >
                            <td style={cellStyle}>{project.serialNumber}</td>
                            <td style={nameCellStyle}>{project.projectName}</td>
                            <td style={cellStyle}>{project.startDate}</td>
                            <td style={cellStyle}>{project.finishDate}</td>
                            <td style={cellStyle}>{project.valueOfContract}</td>
                            <td style={cellStyle}>{project.physicalPlan}</td>
                            <td style={cellStyle}>{project.physicalActual}</td>
                            <td style={cellStyle}>
                              {project.paymentsCertified}
                            </td>
                            <td
                              style={{
                                ...cellStyle,
                                fontSize: "11px",
                                color: "#4a5568",
                              }}
                            >
                              {project.remarks}
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
