import React, { useEffect, useMemo, useState, useRef } from "react";

/**
 * RUDA Development Plan – Timeline (Updated Design)
 * Matches the design from the provided image
 */
export default function RUDAPlanTimeline({
  jsonPath = "/Sheet.json",
  sheetName = "R.Dev Plan (v3.2 Actual udpate)",
}) {
  // ----- CONSTANTS (column ids from your standardized JSON) -----
  const COL_BREAKDOWN = "Project Amount Breakdown \nDevelopment Works";
  const COL_BUDGET_EST = "Budget Estimates\n(PKR Millions)";
  const COL_BUDGET_REV0 = "Budget Estimates \nRev-0\n(PKR Millions)";
  const COL_ONGOING = "Ongoing / Completed";
  const COL_PRIORITY = "Priority Projects";
  const COL_CHANGE = "Change Record";
  const COL_RUDA = "RAVI URBAN DEVELOPMENT AUTHORITY (RUDA)";
  const COL_SECTION = "Section";
  const COL_SN = "Sn.";

  // ----- State -----
  const [raw, setRaw] = useState(null);
  const [activeSheetName, setActiveSheetName] = useState(sheetName);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [expanded, setExpanded] = useState({});
  const [query, setQuery] = useState("");

  const scrollerRef = useRef(null);

  // ----- Data load -----
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(jsonPath);
        if (!r.ok) throw new Error("Failed to fetch JSON");
        const j = await r.json();
        if (!alive) return;
        setRaw(j);
        setErr("");
      } catch (e) {
        setErr(String(e.message || e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [jsonPath]);

  // ----- Sheet list -----
  const sheets = useMemo(() => {
    return raw?.workbook?.sheets ?? [];
  }, [raw]);

  useEffect(() => {
    if (!sheets.length) return;
    if (!sheets.find((s) => String(s.name).trim() === String(activeSheetName).trim())) {
      setActiveSheetName(sheets[0].name);
    }
  }, [sheets]);

  const rows = useMemo(() => {
    const s = sheets.find((x) => String(x.name).trim() === String(activeSheetName).trim());
    return s?.rows ?? [];
  }, [sheets, activeSheetName]);

  // ----- Helpers -----
  const get = (obj, key, fallbacks = []) => {
    if (key in obj) return obj[key];
    const k = Object.keys(obj).find((kk) => kk.trim().toLowerCase() === key.trim().toLowerCase());
    if (k) return obj[k];
    for (const fb of fallbacks) {
      if (fb in obj) return obj[fb];
    }
    return undefined;
  };

  const toNum = (v) => {
    if (v === null || v === undefined || v === "" || v === "-") return null;
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  const fmt = (n) => (n === null || n === undefined || Number.isNaN(n) ? "-" : n.toLocaleString());

  const isPhaseRow = (r) => {
    const rawPhase = get(r, COL_RUDA, [COL_SECTION]);
    const v = String(rawPhase ?? "").trim().toUpperCase();
    return v.startsWith("PHASE");
  };

  const isCategoryRow = (r) => {
    const sn = get(r, COL_SN, ["Unnamed: 1"]);
    const name = get(r, COL_BREAKDOWN, ["Project Amount Breakdown  Development Works", "Unnamed: 2"]);
    return !!name && !!sn && /^[A-Z]$/.test(String(sn).trim());
  };

  const isItemRow = (r) => {
    const sn = get(r, COL_SN, ["Unnamed: 1"]);
    const name = get(r, COL_BREAKDOWN, ["Project Amount Breakdown  Development Works", "Unnamed: 2"]);
    return !!name && !sn && !isPhaseRow(r);
  };

  // Collect FY columns dynamically
  const FY_COLS = useMemo(() => {
    const set = new Set();
    for (const r of rows) Object.keys(r).forEach((k) => { if (/^FY\s*\d{2}\s*[-–]\s*\d{2}$/i.test(k)) set.add(k); });
    const mostFYRow = rows.reduce(
      (best, r) => {
        const c = Object.keys(r).filter((k) => /^FY\s*\d{2}\s*[-–]\s*\d{2}$/i.test(k)).length;
        return c > best.count ? { row: r, count: c } : best;
      },
      { row: null, count: 0 }
    ).row;
    if (!mostFYRow) return Array.from(set);
    const ordered = Object.keys(mostFYRow).filter((k) => /^FY\s*\d{2}\s*[-–]\s*\d{2}$/i.test(k) && set.has(k));
    for (const k of set) if (!ordered.includes(k)) ordered.push(k);
    return ordered;
  }, [rows]);

  // Generate month columns for each FY
  const getMonthsForFY = (fy) => {
    return ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  };

  // ----- Build hierarchy -----
  const hierarchy = useMemo(() => {
    const phases = [];
    let curP = null;
    let curC = null;
    for (const r of rows) {
      if (isPhaseRow(r)) {
        const title = String(get(r, COL_RUDA, [COL_SECTION]) ?? "").trim();
        const amt = toNum(get(r, COL_BUDGET_EST)) ?? toNum(get(r, COL_BUDGET_REV0));
        curP = { title, amount: amt, raw: r, cats: [] };
        phases.push(curP);
        curC = null;
        continue;
      }
      if (!curP) continue;

      if (isCategoryRow(r)) {
        const name = String(get(r, COL_BREAKDOWN, ["Project Amount Breakdown  Development Works", "Unnamed: 2"]) ?? "").trim();
        const amt = toNum(get(r, COL_BUDGET_EST)) ?? toNum(get(r, COL_BUDGET_REV0));
        curC = { name, amount: amt, raw: r, items: [] };
        curP.cats.push(curC);
        continue;
      }

      if (isItemRow(r) && curC) {
        const name = String(get(r, COL_BREAKDOWN, ["Project Amount Breakdown  Development Works", "Unnamed: 2"]) ?? "").trim();
        const amt = toNum(get(r, COL_BUDGET_EST)) ?? toNum(get(r, COL_BUDGET_REV0));
        curC.items.push({ name, amount: amt, raw: r });
      }
    }
    return phases;
  }, [rows]);

  // Filter by search
  const filteredHierarchy = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hierarchy;
    return hierarchy
      .map((p) => {
        const pHit = p.title.toLowerCase().includes(q);
        const cats = p.cats
          .map((c) => {
            const cHit = c.name.toLowerCase().includes(q);
            const its = c.items.filter((it) => it.name.toLowerCase().includes(q));
            if (cHit && its.length === 0) return { ...c, items: c.items };
            if (!cHit && its.length === 0) return null;
            return { ...c, items: its };
          })
          .filter(Boolean);
        if (pHit && cats.length === 0) return p;
        if (pHit || cats.length > 0) return { ...p, cats };
        return null;
      })
      .filter(Boolean);
  }, [hierarchy, query]);

  if (loading) return <div className="ruda-loading">Loading...</div>;
  if (err) return <div className="ruda-error">Error: {err}</div>;

  return (
    <div className="ruda-container">
      {/* Header */}
      <div className="ruda-header">
        <div className="header-left">
          <h1>RUDA DEVELOPMENT PLAN - TIMELINE</h1>
        </div>
        <div className="header-right">
          <button className="home-btn">HOME</button>
        </div>
      </div>

      {/* Controls */}
      <div className="ruda-controls">
        <input
          type="text"
          placeholder="Search phases / packages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={activeSheetName}
          onChange={(e) => {
            setActiveSheetName(e.target.value);
            setExpanded({});
          }}
          className="sheet-select"
        >
          {sheets.map((s) => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-container" ref={scrollerRef}>
        <table className="ruda-table">
          <thead>
            <tr className="header-row">
              <th className="col-phases">PHASES / PACKAGES</th>
              <th className="col-amount">Amount<br/>(PKR, M)</th>
              <th className="col-duration">Duration<br/>(Days)</th>
              <th className="col-schedule">Schedule<br/>%</th>
              <th className="col-performance">Performance<br/>%</th>
              <th className="col-planned">Planned<br/>Value<br/>(PKR, M)</th>
              <th className="col-earned">Earned<br/>Value<br/>(PKR, M)</th>
              <th className="col-actual-start">Actual<br/>Start</th>
              <th className="col-actual-finish">Actual<br/>Finish</th>
              {FY_COLS.map((fy) => (
                <th key={fy} className="col-fy">
                  <div className="fy-header">
                    <div className="fy-title">{fy}</div>
                    <div className="fy-months">
                      {getMonthsForFY(fy).map(month => (
                        <span key={month} className="month-header">{month}</span>
                      ))}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredHierarchy.map((phase, idx) => {
              const isExpanded = expanded[idx];
              
              return (
                <React.Fragment key={phase.title}>
                  {/* Phase Row */}
                  <tr 
                    className="phase-row" 
                    onClick={() => setExpanded(prev => ({ ...prev, [idx]: !isExpanded }))}
                  >
                    <td className="phase-name">
                      <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▲</span>
                      <strong>{phase.title}</strong>
                    </td>
                    <td className="amount">{fmt(phase.amount)}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    {FY_COLS.map((fy) => (
                      <td key={fy} className="fy-cell">
                        <div className="month-cells">
                          {getMonthsForFY(fy).map(month => (
                            <div key={month} className="month-cell"></div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Category and Item Rows */}
                  {isExpanded && phase.cats.map((category) => (
                    <React.Fragment key={category.name}>
                      {/* Category Row */}
                      <tr className="category-row">
                        <td className="item-name">{category.name}</td>
                        <td className="amount">{fmt(category.amount)}</td>
                        <td>{get(category.raw, 'Duration') || '-'}</td>
                        <td>{get(category.raw, 'Schedule %') || '-'}</td>
                        <td>{get(category.raw, 'Performance %') || '-'}</td>
                        <td>{get(category.raw, 'Planned Value') || '-'}</td>
                        <td>{get(category.raw, 'Earned Value') || '-'}</td>
                        <td>{get(category.raw, 'Actual Start') || '-'}</td>
                        <td>{get(category.raw, 'Actual Finish') || '-'}</td>
                        {FY_COLS.map((fy) => (
                          <td key={fy} className="fy-cell">
                            <div className="month-cells">
                              {getMonthsForFY(fy).map(month => {
                                const hasValue = Math.random() > 0.7; // Simulate some data
                                return (
                                  <div 
                                    key={month} 
                                    className={`month-cell ${hasValue ? 'has-value' : ''}`}
                                  ></div>
                                );
                              })}
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Sub-item Rows */}
                      {category.items.map((item) => (
                        <tr key={item.name} className="item-row">
                          <td className="item-name sub-item">{item.name}</td>
                          <td className="amount">{fmt(item.amount)}</td>
                          <td>{get(item.raw, 'Duration') || '-'}</td>
                          <td>{get(item.raw, 'Schedule %') || '-'}</td>
                          <td>{get(item.raw, 'Performance %') || '-'}</td>
                          <td>{get(item.raw, 'Planned Value') || '-'}</td>
                          <td>{get(item.raw, 'Earned Value') || '-'}</td>
                          <td>{get(item.raw, 'Actual Start') || '-'}</td>
                          <td>{get(item.raw, 'Actual Finish') || '-'}</td>
                          {FY_COLS.map((fy) => (
                            <td key={fy} className="fy-cell">
                              <div className="month-cells">
                                {getMonthsForFY(fy).map(month => {
                                  const hasValue = Math.random() > 0.8; // Simulate some data
                                  return (
                                    <div 
                                      key={month} 
                                      className={`month-cell ${hasValue ? 'has-value' : ''}`}
                                    ></div>
                                  );
                                })}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .ruda-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #2c5282;
          min-height: 100vh;
          padding: 0;
          margin: 0;
        }

        .ruda-header {
          background: #2c5282;
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ruda-header h1 {
          margin: 0;
          font-size: 20px;
          font-weight: bold;
        }

        .home-btn {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .home-btn:hover {
          background: #357abd;
        }

        .ruda-controls {
          background: #e2e8f0;
          padding: 10px 20px;
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .search-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #cbd5e0;
          border-radius: 4px;
          font-size: 14px;
        }

        .sheet-select {
          padding: 8px 12px;
          border: 1px solid #cbd5e0;
          border-radius: 4px;
          font-size: 14px;
          min-width: 200px;
        }

        .table-container {
          overflow: auto;
          background: white;
          max-height: calc(100vh - 120px);
        }

        .ruda-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        .header-row {
          background: #4a90e2;
          color: white;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-row th {
          padding: 10px 8px;
          border: 1px solid #357abd;
          text-align: center;
          font-weight: bold;
          font-size: 11px;
          vertical-align: top;
          min-width: 80px;
        }

        .col-phases {
          min-width: 250px;
          text-align: left !important;
        }

        .col-amount {
          min-width: 90px;
        }

        .col-fy {
          min-width: 180px;
          padding: 5px !important;
        }

        .fy-header {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .fy-title {
          font-weight: bold;
          color: white;
          text-align: center;
        }

        .fy-months {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1px;
        }

        .month-header {
          font-size: 10px;
          color: #e2e8f0;
          text-align: center;
          padding: 2px 1px;
        }

        .phase-row {
          background: #2d3748;
          color: white;
          cursor: pointer;
        }

        .phase-row:hover {
          background: #4a5568;
        }

        .phase-row td {
          padding: 12px 8px;
          border: 1px solid #4a5568;
          font-weight: bold;
        }

        .phase-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .expand-icon {
          font-size: 10px;
          transition: transform 0.2s;
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
        }

        .category-row {
          background: #f7fafc;
        }

        .category-row td {
          padding: 10px 8px;
          border: 1px solid #e2e8f0;
        }

        .item-row {
          background: white;
        }

        .item-row td {
          padding: 8px 8px;
          border: 1px solid #e2e8f0;
        }

        .item-name {
          text-align: left;
          font-weight: 500;
        }

        .sub-item {
          padding-left: 20px;
          color: #4a5568;
        }

        .amount {
          text-align: right;
          font-weight: 500;
        }

        .fy-cell {
          padding: 4px !important;
        }

        .month-cells {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1px;
          height: 20px;
        }

        .month-cell {
          background: #f1f5f9;
          border-radius: 2px;
          position: relative;
        }

        .month-cell.has-value {
          background: #22c55e;
        }

        .ruda-loading, .ruda-error {
          padding: 40px;
          text-align: center;
          font-size: 16px;
          background: white;
          margin: 20px;
          border-radius: 8px;
        }

        .ruda-error {
          color: #dc2626;
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .ruda-table {
            font-size: 11px;
          }
          
          .header-row th {
            padding: 8px 6px;
            font-size: 10px;
          }
        }

        @media (max-width: 768px) {
          .ruda-controls {
            flex-direction: column;
            gap: 10px;
          }
          
          .search-input, .sheet-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}