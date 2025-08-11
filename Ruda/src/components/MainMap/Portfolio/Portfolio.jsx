import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import {
  Clock,
  MapPin,
  Building,
  Droplets,
  Recycle,
  Printer,
  Trees,
  Lightbulb,
  Route,
  Waves,
  TrendingUp,
} from "lucide-react";
import "../../../Portfolio.css";
import styles from "./styles";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const API_URL = "http://localhost:5000/api/portfoliocrud/";

// Safe number helpers
const num = (v) => (v === null || v === undefined || v === "" ? 0 : Number(v));
const pctClamp = (v) => Math.max(0, Math.min(100, num(v)));
const fmtPKR = (v) => {
  const n = num(v);
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  return n.toLocaleString();
};

const Portfolio = () => {
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // API returns an array from GET /
        setRow(Array.isArray(json) ? json[0] : json);
      } catch (e) {
        console.error(e);
        setErr("Failed to load data from portfolio API");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const MetricCard = ({ icon: Icon, title, value }) => (
    <div style={styles.metricCard}>
      <div style={styles.metricIcon}>
        <Icon size={20} />
      </div>
      <div style={styles.metricValue}>{value}</div>
      <div style={styles.metricTitle}>{title}</div>
    </div>
  );

  const ProgressCard = ({ title, percentage, color }) => {
    const p = pctClamp(percentage);
    return (
      <div style={styles.progressCard}>
        <div
          style={{
            ...styles.progressCircle,
            background: `conic-gradient(${color} ${p * 3.6}deg, #e5e7eb ${
              p * 3.6
            }deg)`,
          }}
        >
          <div style={styles.progressInner}>
            <span style={{ ...styles.progressText, color }}>{p}%</span>
          </div>
        </div>
        <div style={styles.progressLabel}>{title}</div>
      </div>
    );
  };

  const SustainabilityItem = ({ icon: Icon, title, subtitle, color }) => (
    <div style={styles.sustainabilityItem}>
      <div style={{ ...styles.sustainabilityIcon, backgroundColor: color }}>
        <Icon size={16} color="white" />
      </div>
      <div style={styles.sustainabilityText}>
        <div style={styles.sustainabilityTitle}>{title}</div>
        <div style={styles.sustainabilitySubtitle}>{subtitle}</div>
      </div>
    </div>
  );

  const handleDownloadPDF = async () => {
    const input = document.body;
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      windowWidth: document.body.scrollWidth,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      let heightLeft = imgHeight;
      let position = 0;
      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;
        if (heightLeft > 0) pdf.addPage();
      }
    }
    pdf.save("RUDA_Portfolio.pdf");
  };

  // Responsive flag
  const useMobileView = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return isMobile;
  };
  const isMobile = useMobileView();

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (err || !row) return <div style={{ padding: 16 }}>{err || "No data"}</div>;

  // Map DB values -> chart structures safely
  const developmentData = [
    {
      name: "Residential",
      value: num(row.dev_residential_pct),
      color: row.dev_residential_color || "#8B4513",
    },
    {
      name: "Commercial",
      value: num(row.dev_commercial_pct),
      color: row.dev_commercial_color || "#9932CC",
    },
    {
      name: "Industrial",
      value: num(row.dev_industrial_pct),
      color: row.dev_industrial_color || "#32CD32",
    },
    {
      name: "Mixed Use",
      value: num(row.dev_mixed_use_pct),
      color: row.dev_mixed_use_color || "#FF6347",
    },
    {
      name: "Institutional",
      value: num(row.dev_institutional_pct),
      color: row.dev_institutional_color || "#4169E1",
    },
  ];

  const expenditureData = [
    { year: "FY22-23", amount: num(row.exp_fy22_23_b) },
    { year: "FY23-24", amount: num(row.exp_fy23_24_b) },
    { year: "FY24-25", amount: num(row.exp_fy24_25_b) },
    { year: "FY25-26", amount: num(row.exp_fy25_26_b) },
    { year: "FY26-27", amount: num(row.exp_fy26_27_b) },
  ];
  const totalSpent = expenditureData
    .reduce((s, i) => s + num(i.amount), 0)
    .toFixed(1);

  const financialData = [
    {
      name: "Total Budget",
      value: num(row.financial_total_budget),
      color: row.financial_total_budget_color || "#3b82f6",
    },
    {
      name: "Utilized Budget",
      value: num(row.financial_utilized_budget),
      color: row.financial_utilized_budget_color || "#10b981",
    },
    {
      name: "Remaining Budget",
      value: num(row.financial_remaining_budget),
      color: row.financial_remaining_budget_color || "#f59e0b",
    },
  ];

  // Bar widths (px) based on billons * factor
  const widthFactor = 15; // tweak if you want longer bars
  const plannedB = num(row.budget_planned_till_date_b);
  const certifiedB = num(row.budget_certified_till_date_b);
  const expendB = num(row.budget_expenditure_till_date_b);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{row.title || "RUDA DEVELOPMENT PORTFOLIO"}</h1>

      <Printer
        size={22}
        onClick={handleDownloadPDF}
        style={{
          cursor: "pointer",
          color: "#333",
          marginLeft: "4px",
          marginTop: "-110px",
        }}
      />

      {/* First Row */}
      <div
        style={
          isMobile
            ? { display: "flex", flexDirection: "column", gap: "16px" }
            : styles.firstRow
        }
      >
        {/* RAVI CITY MASTER PLAN */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>RAVI CITY MASTER PLAN</h2>
          <div style={styles.masterPlan}>
            <img
              src={row.master_plan_image_url || "Img.png"}
              alt="Master Plan"
              style={styles.img}
            />
          </div>
        </div>

        {/* DEVELOPMENT COMPONENTS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>DEVELOPMENT COMPONENTS</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={developmentData}
                  dataKey="value"
                  nameKey="name"
                  cx="48%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {developmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}`, name]} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "12px",
                    color: "unset",
                    fontSize: "13px",
                  }}
                  iconSize={12}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KEY METRICS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>KEY METRICS</h2>
          <div style={styles.metricsGrid}>
            <MetricCard
              icon={TrendingUp}
              title="Total Development Budget"
              value={`PKR ${fmtPKR(
                row.metric_total_development_budget_pkr ||
                  row.financial_total_budget
              )}`}
            />
            <MetricCard
              icon={Clock}
              title="Overall Duration"
              value={`${num(row.metric_overall_duration_years)} Years`}
            />
            <MetricCard
              icon={MapPin}
              title="Total Area"
              value={`${num(
                row.metric_total_area_acres
              ).toLocaleString()} Acres`}
            />
            <MetricCard
              icon={Building}
              title="Total Projects"
              value={`${num(row.metric_total_projects)}`}
            />
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div
        style={
          isMobile
            ? { display: "flex", flexDirection: "column", gap: "16px" }
            : styles.secondRow
        }
      >
        {/* DEVELOPMENT TIMELINES */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>DEVELOPMENT TIMELINES</h2>
          <div style={styles.timelineContainer}>
            <div style={styles.timelineDuration}>
              <span style={styles.durationLabel}>DURATION</span>
              <div style={styles.durationChips}>
                <span style={{ ...styles.chip, ...styles.chipGreen }}>
                  {num(row.timeline_elapsed_years)} YEARS
                </span>
                <span style={{ ...styles.chip, ...styles.chipBlue }}>
                  {num(row.timeline_remaining_years)} YEARS
                </span>
              </div>
            </div>
            <div style={styles.timelineYears}>
              <span>{row.timeline_start_label || ""}</span>
              <span>{row.timeline_mid_label || ""}</span>
              <span>{row.timeline_end_label || ""}</span>
            </div>
            <div style={styles.timelineBar}>
              <div style={styles.timelineElapsed} />
              <div style={styles.timelineRemaining} />
            </div>
            <div style={styles.timelineLegend}>
              <div style={styles.legendItem}>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#10b981" }}
                />
                <span style={styles.legendText}>TIME ELAPSED</span>
              </div>
              <div style={styles.legendItem}>
                <div
                  style={{ ...styles.legendColor, backgroundColor: "#3b82f6" }}
                />
                <span style={styles.legendText}>REMAINING TIME</span>
              </div>
            </div>
          </div>
        </div>

        {/* OVERALL PROGRESS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>OVERALL PROGRESS</h2>
          <div style={styles.progressContainer}>
            <ProgressCard
              title="Planned"
              percentage={num(row.progress_planned_pct)}
              color="#2196f3"
            />
            <ProgressCard
              title="Actual"
              percentage={num(row.progress_actual_pct)}
              color="#4caf50"
            />
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div
        style={
          isMobile
            ? { display: "flex", flexDirection: "column", gap: "16px" }
            : styles.thirdRow
        }
      >
        {/* FINANCIAL OVERVIEW */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>FINANCIAL OVERVIEW</h2>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis axisLine={false} tick={false} domain={[0, "auto"]} />
                <Tooltip formatter={(value) => fmtPKR(value)} />
                <Bar dataKey="value">
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.customLegend}>
            {financialData.map((item, index) => (
              <div key={index} style={styles.legendItem}>
                <div
                  style={{ ...styles.legendColor, backgroundColor: item.color }}
                />
                <span style={styles.legendText}>{fmtPKR(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FY24-25 BUDGET STATUS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>FY24-25 BUDGET STATUS</h2>
          <div style={styles.budgetContainer}>
            <div style={styles.budgetItem}>
              <div style={styles.budgetLabel}>Planned Till Date FY24-25</div>
              <div
                style={{
                  ...styles.budgetBar3D,
                  backgroundColor: "#003366",
                  width: `${Math.max(
                    10,
                    Math.round(plannedB * widthFactor)
                  )}px`,
                }}
              >
                {plannedB.toFixed(2)} B
              </div>
            </div>

            <div style={styles.budgetItem}>
              <div style={styles.budgetLabel}>
                Certified Amount Till Date FY24-25
              </div>
              <div
                style={{
                  ...styles.budgetBar3D,
                  backgroundColor: "#2e7d32",
                  width: `${Math.max(
                    10,
                    Math.round(certifiedB * widthFactor)
                  )}px`,
                }}
              >
                {certifiedB.toFixed(2)} B
              </div>
            </div>

            <div style={styles.budgetItem}>
              <div style={styles.budgetLabel}>
                Expenditure Till Date FY24-25
              </div>
              <div
                style={{
                  ...styles.budgetBar3D,
                  backgroundColor: "#a84320",
                  width: `${Math.max(10, Math.round(expendB * widthFactor))}px`,
                }}
              >
                {expendB.toFixed(2)} B
              </div>
            </div>
          </div>
        </div>

        {/* YEAR-WISE EXPENDITURE */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Year-wise Expenditure</h2>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={expenditureData}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => `Rs. ${num(value)}B`} />
                <Bar dataKey="amount" fill="#3b82f6">
                  <LabelList
                    dataKey="amount"
                    position="top"
                    formatter={(value) => `Rs. ${num(value)}B`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div
            style={{
              textAlign: "right",
              marginTop: "8px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Total Spent: Rs. {totalSpent}B
          </div>
        </div>
      </div>

      {/* Fourth Row */}
      <div
        style={
          isMobile
            ? { display: "flex", flexDirection: "column", gap: "16px" }
            : styles.fourthRow
        }
      >
        {/* KEY ACHIEVEMENTS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>KEY ACHIEVEMENTS</h2>
          <div style={styles.achievementsContainer}>
            <div style={styles.achievementsContent}>
              <TrendingUp
                size={32}
                style={{ margin: "0 auto 8px", display: "block" }}
              />
              <span>
                Key achievements and milestones will be displayed here
              </span>
            </div>
          </div>
        </div>

        {/* SUSTAINABILITY HIGHLIGHTS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>SUSTAINABILITY HIGHLIGHTS</h2>
          <div
            style={
              isMobile
                ? { display: "flex", flexDirection: "column", gap: "12px" }
                : styles.sustainabilityContainer
            }
          >
            <SustainabilityItem
              icon={Droplets}
              title="RIVER CHANNELIZATION"
              subtitle={`${num(row.sustainability_river_channelization_km)} KM`}
              color="#2196f3"
            />
            <SustainabilityItem
              icon={Waves}
              title="BARRAGES"
              subtitle={`${num(row.sustainability_barrages_count)}`}
              color="#f55098"
            />
            <SustainabilityItem
              icon={Recycle}
              title="SOLID WASTE MANAGEMENT"
              subtitle={`${row.sustainability_swm_text || ""}`}
              color="#df6f12"
            />
            <SustainabilityItem
              icon={Trees}
              title="AFFORESTATION"
              subtitle={`${num(
                row.sustainability_afforestation_acres
              ).toLocaleString()} Acres`}
              color="#4caf50"
            />
            <SustainabilityItem
              icon={Route}
              title="Trunk Infrastructure"
              subtitle={`${row.sustainability_trunk_infrastructure_text || ""}`}
              color="#336819"
            />
            <SustainabilityItem
              icon={Lightbulb}
              title="DRY UTILITIES"
              subtitle={`${row.sustainability_dry_utilities_text || ""}`}
              color="#ffc107"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
