import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Grid,
} from "@mui/material";

const ProgressUpdate = () => {
  const [selectedFY, setSelectedFY] = useState("24-25");
  const [sheetData, setSheetData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Available FY options
  const fyOptions = ["24-25", "25-26"];

  useEffect(() => {
    // Load Sheet.json data
    fetch("/Sheet.json")
      .then((response) => response.json())
      .then((data) => {
        setSheetData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading sheet data:", error);
        setLoading(false);
      });
  }, []);

  // Calculate values based on selected FY
  const calculateValues = () => {
    if (!sheetData || !sheetData.workbook?.sheets?.[0]?.rows) {
      return {
        devBudget: 0,
        plan: 12.94,
        certified: 6.85,
        paid: 6.11,
        planPercent: 81,
        actualPercent: 42,
        performanceEfficiency: 51,
      };
    }

    const rows = sheetData.workbook.sheets[0].rows;
    const fyColumn = `FY ${selectedFY}`;

    // Find the "Proposed Budget" row for dev budget
    const proposedBudgetRow = rows.find(
      (row) =>
        row["Project Amount Breakdown \nDevelopment Works"] ===
        "Proposed Budget"
    );

    let devBudget = 0;
    if (proposedBudgetRow && proposedBudgetRow[fyColumn]) {
      devBudget = proposedBudgetRow[fyColumn] / 1000; // Convert to billions
    }

    // For FY 24-25, use actual values, for others use 0
    if (selectedFY === "24-25") {
      const plan = 12.94;
      const certified = 6.85;
      const paid = 6.11;

      // Calculate percentages: PLAN % = PLAN/DEV BUDGET * 100, ACTUAL % = CERTIFIED/DEV BUDGET * 100
      const planPercent = devBudget > 0 ? (plan / devBudget) * 100 : 81;
      const actualPercent = devBudget > 0 ? (certified / devBudget) * 100 : 42;
      const performanceEfficiency =
        planPercent > 0 ? (actualPercent / planPercent) * 100 : 51;

      return {
        devBudget: devBudget,
        plan: plan,
        certified: certified,
        paid: paid,
        planPercent: Math.round(planPercent),
        actualPercent: Math.round(actualPercent),
        performanceEfficiency: Math.round(performanceEfficiency),
      };
    } else {
      // For other years, show 0 values but keep headings
      return {
        devBudget: devBudget,
        plan: 0,
        certified: 0,
        paid: 0,
        planPercent: 0,
        actualPercent: 0,
        performanceEfficiency: 0,
      };
    }
  };

  const values = calculateValues();

  // Color determination based on percentage
  const getBoxColor = (value, type) => {
    if (type === "green") return "#4CAF50"; // 90% to 100%
    if (type === "orange") return "#FF9800"; // 75% to 89%
    if (type === "blue") return "#2196F3"; // Below 75%

    // Default color logic based on value
    if (value >= 90) return "#4CAF50";
    if (value >= 75) return "#FF9800";
    return "#2196F3";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#2c5282",
          color: "white",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            margin: 0,
            fontSize: "20px",
          }}
        >
          PROGRESS UPDATE - CFY ONGOING WORKS
        </Typography>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: "white" }}>FY</InputLabel>
          <Select
            value={selectedFY}
            onChange={(e) => setSelectedFY(e.target.value)}
            sx={{
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
          >
            {fyOptions.map((fy) => (
              <MenuItem key={fy} value={fy}>
                {fy}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Main Content */}
      <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Main Grid Container - Exact layout from image */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "8px",
            height: "400px",
            marginBottom: "20px",
          }}
        >
          {/* DEV BUDGET Box - Large box on left spanning 2 rows */}
          <Box
            sx={{
              gridColumn: "1 / 2",
              gridRow: "1 / 3",
              backgroundColor: getBoxColor(0, "blue"),
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "20px",
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: "8px", fontSize: "16px" }}
            >
              DEV. BUDGET
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: "15px", fontSize: "14px" }}
            >
              FY {selectedFY}
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", fontSize: "48px" }}
            >
              {values.devBudget.toFixed(2)} B
            </Typography>
          </Box>

          {/* PLAN Box - Top row, second column */}
          <Box
            sx={{
              gridColumn: "2 / 3",
              gridRow: "1 / 2",
              backgroundColor: getBoxColor(0, "blue"),
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "15px",
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}
            >
              PLAN
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: "8px", fontSize: "12px" }}
            >
              TILL DATE
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", fontSize: "32px" }}
            >
              {values.plan.toFixed(2)} B
            </Typography>
          </Box>

          {/* CERTIFIED Box - Top row, third column */}
          <Box
            sx={{
              gridColumn: "3 / 4",
              gridRow: "1 / 2",
              backgroundColor: getBoxColor(0, "green"),
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "15px",
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}
            >
              CERTIFIED
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: "8px", fontSize: "12px" }}
            >
              TILL DATE
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", fontSize: "32px" }}
            >
              {values.certified.toFixed(2)} B
            </Typography>
          </Box>

          {/* PAID Box - Top row, fourth column */}
          <Box
            sx={{
              gridColumn: "4 / 5",
              gridRow: "1 / 2",
              backgroundColor: getBoxColor(0, "green"),
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "15px",
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}
            >
              PAID
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: "8px", fontSize: "12px" }}
            >
              TILL DATE
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", fontSize: "32px" }}
            >
              {values.paid.toFixed(2)} B
            </Typography>
          </Box>

          {/* PLAN % Box - Bottom row, second column */}
          <Box
            sx={{
              gridColumn: "2 / 3",
              gridRow: "2 / 3",
              backgroundColor: getBoxColor(0, "orange"),
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "15px",
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}
            >
              PLAN %
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: "8px", fontSize: "12px" }}
            >
              TILL DATE
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", fontSize: "48px" }}
            >
              {values.planPercent}%
            </Typography>
          </Box>

          {/* ACTUAL % Box - Bottom row, spans third and fourth columns */}
          <Box
            sx={{
              gridColumn: "3 / 5",
              gridRow: "2 / 3",
              backgroundColor: "#B0B0B0", // Light gray as shown in image
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "15px",
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}
            >
              ACTUAL %
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: "8px", fontSize: "12px" }}
            >
              TILL DATE
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", fontSize: "48px" }}
            >
              {values.actualPercent}%
            </Typography>
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ marginBottom: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Box
                  sx={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#4CAF50",
                    borderRadius: "2px",
                  }}
                />
                <Typography variant="body2">90% to 100%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Box
                  sx={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#FF9800",
                    borderRadius: "2px",
                  }}
                />
                <Typography variant="body2">75% to 89%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Box
                  sx={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#2196F3",
                    borderRadius: "2px",
                  }}
                />
                <Typography variant="body2">Below 75%</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Performance Efficiency */}
        <Paper
          sx={{
            backgroundColor: "#333",
            color: "white",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            PERFORMANCE EFFICIENCY: {values.performanceEfficiency}%
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProgressUpdate;
