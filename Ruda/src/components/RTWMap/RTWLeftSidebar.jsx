import React from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import * as turf from "@turf/turf";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CancelIcon from "@mui/icons-material/Cancel";

const COLORS = ["#00cc00", "#ff3333"];

const RTWLeftSidebar = ({
  areaStats,
  showChart,
  setShowChart,
  projectFeatures,
  projectVisibility,
  allAvailableFeaturesRef,
}) => {
  const chartData = areaStats
    ? [
        { name: "Available", value: areaStats.available },
        { name: "Unavailable", value: areaStats.unavailable },
      ]
    : [];

  return (
    <>
      {/* Toggle buttons for mobile */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1100,
          display: { xs: "flex", md: "none" },
          gap: 1,
        }}
      >
        <Button
          size="small"
          onClick={() => setShowChart(true)}
          sx={{
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "1px solid #fff",
            color: "#fff",
            textTransform: "none",
            fontSize: "0.75rem",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
          }}
        >
          Show Chart
        </Button>
      </Box>

      {/* Chart Panel */}
      {areaStats && (
        <Card
          elevation={6}
          sx={{
            display: { xs: showChart ? "block" : "none", md: "block" },
            position: "absolute",
            top: { xs: 50, md: 20 },
            left: { xs: 10, md: 20 },
            width: { xs: 270, sm: 300, md: 360 },
            maxHeight: { xs: "90vh", md: "none" },
            overflowY: { xs: "auto", md: "visible" },
            zIndex: 1000,
            borderRadius: 2,
            bgcolor: "rgba(20, 20, 20, 0.92)",
            color: "white",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle2">Land Distribution</Typography>
            <IconButton
              size="small"
              onClick={() => setShowChart(false)}
              sx={{ color: "white" }}
            >
              <CancelIcon />
            </IconButton>
          </Box>
          <Typography
            variant="h6"
            sx={{ display: { xs: "none", md: "block" } }}
            gutterBottom
          >
            Land Area Distribution
          </Typography>

          <Box sx={{ width: "100%", height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="60%"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v.toFixed(2)} acres`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Divider sx={{ my: 1, borderColor: "#555" }} />

          <Typography variant="body2">
            ⚪ <strong>Total RTW P-02 Area:</strong>{" "}
            {areaStats?.projectArea?.toFixed(2) || "0.00"} acres
          </Typography>
          <Typography variant="body2">
            🟢 <strong>Available Area:</strong>{" "}
            {areaStats?.availableArea?.toFixed(2) || "0.00"} acres
          </Typography>
          <Typography variant="body2">
            🔴 <strong>Unavailable Area:</strong>{" "}
            {(
              (areaStats?.projectArea || 0) - (areaStats?.availableArea || 0)
            ).toFixed(2)}{" "}
            acres
          </Typography>

          <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
            ➤ Available Polygons:
          </Typography>
          {(() => {
            const visibleRedNames = projectFeatures
              .filter((f) => projectVisibility[f.properties.name])
              .map((f) => f.properties.name.trim());

            const matchingGreen = allAvailableFeaturesRef.current.filter((f) =>
              visibleRedNames.includes(f.properties?.name?.trim())
            );

            return matchingGreen
              .map((f) => {
                const name = f.properties?.name || `Unnamed`;
                const area = turf.area(f) / 4046.8564224;
                return { name, area };
              })
              .sort((a, b) => a.area - b.area)
              .map((p, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  sx={{ ml: 2, color: "#90ee90" }}
                >
                  • {p.name}: {p.area.toFixed(2)} acres
                </Typography>
              ));
          })()}
        </Card>
      )}
    </>
  );
};

export default RTWLeftSidebar;
