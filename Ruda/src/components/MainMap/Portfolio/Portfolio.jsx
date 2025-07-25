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

const RudaPortfolioDashboard = () => {
  const developmentData = [
    { name: "Residential", value: 30, color: "#8B4513" },
    { name: "Commercial", value: 25, color: "#9932CC" },
    { name: "Industrial", value: 20, color: "#32CD32" },
    { name: "Mixed Use", value: 15, color: "#FF6347" },
    { name: "Institutional", value: 10, color: "#4169E1" },
  ];

  const expenditureData = [
    { year: "FY22-23", amount: 2.8 },
    { year: "FY23-24", amount: 3.2 },
    { year: "FY24-25", amount: 4.1 },
    { year: "FY25-26", amount: 3.8 },
    { year: "FY26-27", amount: 4.5 },
  ];

  const totalSpent = expenditureData
    .reduce((sum, item) => sum + item.amount, 0)
    .toFixed(1);

  const financialData = [
    { name: "Total Budget", value: 1.66e12, color: "#3b82f6" }, // 1.66 Trillion
    { name: "Utilized Budget", value: 7.9e9, color: "#10b981" }, // 7.9 Billion
    { name: "Remaining Budget", value: 1.65e12, color: "#f59e0b" }, // 1.65 Trillion
  ];

  const formatValue = (value) => {
    if (value >= 1e12) {
      return (value / 1e12).toFixed(2) + "T"; // Trillion
    }
    if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + "B"; // Billion
    }
    return value.toFixed(2); // Default for smaller values
  };

  const MetricCard = ({ icon: Icon, title, value }) => (
    <div style={styles.metricCard}>
      <div style={styles.metricIcon}>
        <Icon size={20} />
      </div>
      <div style={styles.metricValue}>{value}</div>
      <div style={styles.metricTitle}>{title}</div>
    </div>
  );

  const ProgressCard = ({ title, percentage, color }) => (
    <div style={styles.progressCard}>
      <div
        style={{
          ...styles.progressCircle,
          background: `conic-gradient(${color} ${
            percentage * 3.6
          }deg, #e5e7eb ${percentage * 3.6}deg)`,
        }}
      >
        <div style={styles.progressInner}>
          <span style={{ ...styles.progressText, color: color }}>
            {percentage}%
          </span>
        </div>
      </div>
      <div style={styles.progressLabel}>{title}</div>
    </div>
  );

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

    // If image height fits within one page
    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      // Multi-page logic, no extra space below
      let heightLeft = imgHeight;
      let position = 0;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;

        if (heightLeft > 0) {
          pdf.addPage();
        }
      }
    }

    pdf.save("RUDA_Portfolio.pdf");
  };

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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>RUDA DEVELOPMENT PORTFOLIO</h1>

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

      {/* First Row - 3 containers */}
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
            <img src="Img.png" alt="Master Plan" style={styles.img} />
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
                    color: "unset", // ✅ removes any inherited forced color
                    fontSize: "13px", // ✅ optional tweak
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
              value="PKR 1.66 T"
            />
            <MetricCard
              icon={Clock}
              title="Overall Duration"
              value="15 Years"
            />
            <MetricCard
              icon={MapPin}
              title="Total Area"
              value="110,000 Acres"
            />
            <MetricCard icon={Building} title="Total Projects" value="165" />
          </div>
        </div>
      </div>

      {/* Second Row - 2 containers */}
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
                  4.5 YEARS
                </span>
                <span style={{ ...styles.chip, ...styles.chipBlue }}>
                  11.5 YEARS
                </span>
              </div>
            </div>
            <div style={styles.timelineYears}>
              <span>FY21-22</span>
              <span>FY24-25</span>
              <span>FY36-37</span>
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
            <ProgressCard title="Planned" percentage={1.2} color="#2196f3" />
            <ProgressCard title="Actual" percentage={1.1} color="#4caf50" />
          </div>
        </div>
      </div>

      {/* Third Row - 3 containers */}
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
                <Tooltip formatter={(value) => formatValue(value)} />

                <Bar dataKey="value">
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend under the chart */}
          <div style={styles.customLegend}>
            {financialData.map((item, index) => (
              <div key={index} style={styles.legendItem}>
                <div
                  style={{ ...styles.legendColor, backgroundColor: item.color }}
                />
                <span style={styles.legendText}>{` ${formatValue(
                  item.value
                )}`}</span>
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
                  backgroundColor: "#003366", // Dark blue
                  width: "250px", // Adjust per bar length
                }}
              >
                15.96 B
              </div>
            </div>

            <div style={styles.budgetItem}>
              <div style={styles.budgetLabel}>
                Certified Amount Till Date FY24-25
              </div>
              <div
                style={{
                  ...styles.budgetBar3D,
                  backgroundColor: "#2e7d32", // Green
                  width: "160px",
                }}
              >
                7.5 B
              </div>
            </div>

            <div style={styles.budgetItem}>
              <div style={styles.budgetLabel}>
                Expenditure Till Date FY24-25
              </div>
              <div
                style={{
                  ...styles.budgetBar3D,
                  backgroundColor: "#a84320", // Orange/Brown
                  width: "140px",
                }}
              >
                7.1 B
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
                <Tooltip formatter={(value) => `Rs. ${value}B`} />
                <Bar dataKey="amount" fill="#3b82f6">
                  <LabelList
                    dataKey="amount"
                    position="top"
                    formatter={(value) => `Rs. ${value}B`}
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

      {/* Fourth Row - 2 containers */}
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
              subtitle="46 KM"
              color="#2196f3"
            />
            <SustainabilityItem
              icon={Waves}
              title="BARRAGES"
              subtitle="3"
              color="#f55098"
            />
            <SustainabilityItem
              icon={Recycle}
              title="SOLID WASTE MANAGEMENT"
              subtitle="Integrated System"
              color="#df6f12"
            />
            <SustainabilityItem
              icon={Trees}
              title="AFFORESTATION"
              subtitle="5,363 Acres"
              color="#4caf50"
            />

            <SustainabilityItem
              icon={Route}
              title="Trunk Infrastructure "
              subtitle="Smart "
              color="#336819 "
            />
            <SustainabilityItem
              icon={Lightbulb}
              title="DRY UTILITIES"
              subtitle="Smart Infrastructure"
              color="#ffc107"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RudaPortfolioDashboard;
