import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../dashboard.css";

const PriorityProjectsTable = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/Sheet.json");
        const json = await res.json();
        const sheet = json.workbook?.sheets?.[0];

        if (!sheet?.rows) throw new Error("Invalid data");

        const priorityProjects = [];
        let serial = 1;

        sheet.rows.forEach((row) => {
          const projectName =
            row["Project Amount Breakdown \nDevelopment Works"];
          const category = row["Project Category"];
          const budget = row["Project Cost (PKR Million)"];

          // Only include priority projects
          if (
            category &&
            category.toLowerCase().includes("priority") &&
            projectName
          ) {
            priorityProjects.push({
              id: serial++,
              projectName,
              budget: budget ? `PKR ${Number(budget).toLocaleString()} M` : "-",
            });
          }
        });

        setProjects(priorityProjects.slice(0, 8)); // Show top few
        setFiltered(priorityProjects.slice(0, 8));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleSearch = (q) => {
    const query = q.toLowerCase();
    setFiltered(
      projects.filter((p) => p.projectName.toLowerCase().includes(query))
    );
  };

  if (loading) {
    return (
      <div className="widget" style={styles.widgetContainer}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading priority projects...
        </div>
      </div>
    );
  }

  return (
    <div className="widget" style={styles.widgetContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h6
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            margin: 0,
            letterSpacing: "0.5px",
            color: "#ffffff",
          }}
        >
          PRIORITY PROJECTS
        </h6>
      </div>

      {/* Project List */}
      <div style={styles.listContainer} className="no-scrollbar">
        {filtered.map((p) => (
          <button
            key={p.id}
            className="list-group-item text-left"
            style={styles.projectButton}
            onClick={() => navigate("/priority-projects")}
          >
            <div>
              <h6 style={styles.projectName}>{p.projectName}</h6>
              <p style={styles.projectBudget}>Budget: {p.budget}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Search */}
      <footer style={styles.footer}>
        <input
          type="search"
          placeholder="Search"
          style={styles.searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </footer>
    </div>
  );
};

// ---------- STYLES ----------
const styles = {
  widgetContainer: {
    borderRadius: "8px",
    overflow: "hidden",
    color: "white",
    width: "380px",
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "340px",
    overflowY: "scroll",
  },
  projectButton: {
    background: "transparent",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    border: "none",
    padding: "10px 14px",
    textAlign: "left",
    cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    transition: "background 0.2s",
  },
  projectName: {
    margin: 0,
    fontSize: "0.9rem",
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  projectBudget: {
    margin: 0,
    fontSize: "0.8rem",
    opacity: 0.7,
  },
  footer: {
    background: "rgba(255,255,255,0.02)",
    padding: "10px 12px",
  },
  searchInput: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "4px",
    border: "none",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    outline: "none",
  },
};

export default PriorityProjectsTable;
