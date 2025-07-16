import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Clock,
  MapPin,
  Building,
  Droplets,
  Recycle,
  Trees,
  Lightbulb, Route, Waves,
  TrendingUp
} from 'lucide-react';
import "../../Portfolio.css"
import styles from "./styles"


const RudaPortfolioDashboard = () => {
  const developmentData = [
    { name: 'Residential', value: 30, color: '#8B4513' },
    { name: 'Commercial', value: 25, color: '#9932CC' },
    { name: 'Industrial', value: 20, color: '#32CD32' },
    { name: 'Mixed Use', value: 15, color: '#FF6347' },
    { name: 'Institutional', value: 10, color: '#4169E1' }
  ];

  const expenditureData = [
    { year: 'FY22-23', amount: 2.8 },
    { year: 'FY23-24', amount: 3.2 },
    { year: 'FY24-25', amount: 4.1 },
    { year: 'FY25-26', amount: 3.8 },
    { year: 'FY26-27', amount: 4.5 }
  ];



  const financialData = [
    { name: 'Total Budget', value: 1.66e12, color: '#3b82f6' },  // 1.66 Trillion
    { name: 'Utilized Budget', value: 7.9e9, color: '#10b981' },  // 7.9 Billion
    { name: 'Remaining Budget', value: 1.65e12, color: '#f59e0b' } // 1.65 Trillion
  ];

  const formatValue = (value) => {
    if (value >= 1e12) {
      return (value / 1e12).toFixed(2) + 'T'; // Trillion
    }
    if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + 'B'; // Billion
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
      <div style={{
        ...styles.progressCircle,
        background: `conic-gradient(${color} ${percentage * 3.6}deg, #e5e7eb ${percentage * 3.6}deg)`
      }}>
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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const total = developmentData.reduce((acc, item) => acc + item.value, 0);
      const percentage = ((value / total) * 100).toFixed(2);
      return (
        <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
          <strong>{name}</strong>
          <div>{`Value: ${value}`}</div>
          <div>{`Percentage: ${percentage}%`}</div>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, value, index } = props;
    const radius = outerRadius + 10; // position label outside the slice
    const angle = midAngle * (Math.PI / 180); // Convert angle to radians
    const x = cx + radius * Math.cos(angle); // X position of the label
    const y = cy + radius * Math.sin(angle); // Y position of the label
    const total = developmentData.reduce((acc, item) => acc + item.value, 0);
    const percentage = ((value / total) * 100).toFixed(2);

    return (
      <g>
        <text x={x} y={y} textAnchor="middle" fill="#000" fontSize="14" fontWeight="bold">
          {`${percentage}%`} {/* Display percentage */}
        </text>
        {/* Optional: Add a line connecting the label to the pie slice */}
        <line
          x1={cx}
          y1={cy}
          x2={x}
          y2={y}
          stroke={developmentData[index].color}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </g>
    );
  };
  const CustomLegend = ({ payload }) => (
    <div style={styles.customLegend}>
      {payload.map((entry, index) => (
        <div key={index} style={styles.legendEntry}>
          <div style={{ ...styles.legendDot, backgroundColor: entry.color }} />
          <span style={{ fontSize: '12px' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        RUDA DEVELOPMENT PORTFOLIO
      </h1>

      {/* First Row - 3 containers */}
      <div style={styles.firstRow}>
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
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={developmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {developmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KEY METRICS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            KEY METRICS
          </h2>
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
            <MetricCard
              icon={Building}
              title="Total Projects"
              value="165"
            />
          </div>
        </div>
      </div>

      {/* Second Row - 2 containers */}
      <div style={styles.secondRow}>
        {/* DEVELOPMENT TIMELINES */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            DEVELOPMENT TIMELINES
          </h2>
          <div style={styles.timelineContainer}>
            <div style={styles.timelineDuration}>
              <span style={styles.durationLabel}>DURATION</span>
              <div style={styles.durationChips}>
                <span style={{ ...styles.chip, ...styles.chipGreen }}>4.5 YEARS</span>
                <span style={{ ...styles.chip, ...styles.chipBlue }}>11.5 YEARS</span>
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
                <div style={{ ...styles.legendColor, backgroundColor: '#10b981' }} />
                <span style={styles.legendText}>TIME ELAPSED</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendColor, backgroundColor: '#3b82f6' }} />
                <span style={styles.legendText}>REMAINING TIME</span>
              </div>
            </div>
          </div>
        </div>

        {/* OVERALL PROGRESS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            OVERALL PROGRESS
          </h2>
          <div style={styles.progressContainer}>
            <ProgressCard title="Planned" percentage={1.2} color="#2196f3" />
            <ProgressCard title="Actual" percentage={1.1} color="#4caf50" />
          </div>
        </div>
      </div>

      {/* Third Row - 3 containers */}
      <div style={styles.thirdRow}>
        {/* FINANCIAL OVERVIEW */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>FINANCIAL OVERVIEW</h2>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis axisLine={false} tick={false} domain={[0, 'auto']} />
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
                <div style={{ ...styles.legendColor, backgroundColor: item.color }} />
                <span style={styles.legendText}>{` ${formatValue(item.value)}`}</span>
              </div>
            ))}
          </div>

        </div>

        {/* FY24-25 BUDGET STATUS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            FY24-25 BUDGET STATUS
          </h2>
          <div style={styles.budgetContainer}>
            <div style={styles.budgetItem}>
              <div style={styles.budgetLabel}>Planned Till Date FY24-25</div>
              <div style={styles.budgetBar}>
                <div style={styles.budgetProgress}>
                  <div style={{ ...styles.budgetFill, backgroundColor: '#3b82f6', width: '85%' }} />
                </div>
                <span style={styles.budgetValue}>15.36 B</span>
              </div>
            </div>
            <div style={styles.budgetItem}>
              <div style={styles.budgetLabel}>Certified Amount Till Date FY24-25</div>
              <div style={styles.budgetBar}>
                <div style={styles.budgetProgress}>
                  <div style={{ ...styles.budgetFill, backgroundColor: '#10b981', width: '45%' }} />
                </div>
                <span style={styles.budgetValue}>7.5 B</span>
              </div>
            </div>
            <div style={styles.budgetItem}>
              <div style={styles.budgetLabel}>Expenditure Till Date FY24-25</div>
              <div style={styles.budgetBar}>
                <div style={styles.budgetProgress}>
                  <div style={{ ...styles.budgetFill, backgroundColor: '#f59e0b', width: '35%' }} />
                </div>
                <span style={styles.budgetValue}>7.1 B</span>
              </div>
            </div>
          </div>
        </div>

        {/* YEAR-WISE EXPENDITURE */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            YEAR-WISE EXPENDITURE
          </h2>
          <div style={styles.expenditureLabel}>(PKR MILLIONS)</div>
          <div style={styles.expenditureContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenditureData}>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Bar dataKey="amount" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fourth Row - 2 containers */}
      <div style={styles.fourthRow}>
        {/* KEY ACHIEVEMENTS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            KEY ACHIEVEMENTS
          </h2>
          <div style={styles.achievementsContainer}>
            <div style={styles.achievementsContent}>
              <TrendingUp size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
              <span>Key achievements and milestones will be displayed here</span>
            </div>
          </div>
        </div>

        {/* SUSTAINABILITY HIGHLIGHTS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            SUSTAINABILITY HIGHLIGHTS
          </h2>
          <div style={styles.sustainabilityContainer}>
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