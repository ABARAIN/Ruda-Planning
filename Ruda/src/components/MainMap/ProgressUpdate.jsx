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

  const fyOptions = ["24-25", "25-26"];

  useEffect(() => {
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

  const calculateValues = () => {
    if (!sheetData || !sheetData.workbook?.sheets?.[0]?.rows) {
      return {
        devBudget: 15.96,
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
    const proposedBudgetRow = rows.find(
      (row) =>
        row["Project Amount Breakdown \nDevelopment Works"] ===
        "Proposed Budget"
    );

    let devBudget = 0;
    if (proposedBudgetRow && proposedBudgetRow[fyColumn]) {
      devBudget = proposedBudgetRow[fyColumn] / 1000;
    }

    if (selectedFY === "24-25") {
      const plan = 12.94;
      const certified = 6.85;
      const paid = 6.11;
      const planPercent = devBudget > 0 ? (plan / devBudget) * 100 : 81;
      const actualPercent = devBudget > 0 ? (certified / devBudget) * 100 : 42;
      const performanceEfficiency =
        planPercent > 0 ? (actualPercent / planPercent) * 100 : 51;

      return {
        devBudget,
        plan,
        certified,
        paid,
        planPercent: Math.round(planPercent),
        actualPercent: Math.round(actualPercent),
        performanceEfficiency: Math.round(performanceEfficiency),
      };
    } else {
      return {
        devBudget,
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

  const getBoxColor = (value, type) => {
    if (type === "green") return "#8CB971"; // Certified/Paid
    if (type === "orange") return "#F4A261"; // Plan %
    if (type === "blue") return "#2F80ED"; // Budget/Plan
    return "#D9D9D9"; // Actual %
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
        backgroundColor: "#fff",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        padding: "10px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#2c5282",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "18px",
            textTransform: "uppercase",
          }}
        >
          Progress Update – CFY Ongoing Works
        </Typography>

        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel sx={{ color: "white" }}>FY</InputLabel>
          <Select
            value={selectedFY}
            onChange={(e) => setSelectedFY(e.target.value)}
            sx={{
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
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

      {/* Grid Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gridTemplateRows: "1fr 1fr",
          gap: "15px",
          marginTop: "20px",
          marginBottom: "20px",
          height: "calc(100vh - 180px)",
        }}
      >
        {/* DEV BUDGET */}
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
            borderRadius: "6px",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontSize: "14px" }}>
            DEV. BUDGET
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "10px" }}>
            FY {selectedFY}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: "bold" }}>
            {values.devBudget.toFixed(2)} B
          </Typography>
        </Box>

        {/* TOP ROW (Plan, Certified, Paid) */}
        <Box
          sx={{
            gridColumn: "2 / 3",
            gridRow: "1 / 2",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px",
          }}
        >
          {/* PLAN */}
          <Box
            sx={{
              backgroundColor: getBoxColor(0, "blue"),
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <Typography variant="subtitle2">PLAN</Typography>
            <Typography variant="body2">TILL DATE</Typography>
            <Typography variant="h4">{values.plan.toFixed(2)} B</Typography>
          </Box>

          {/* CERTIFIED */}
          <Box
            sx={{
              backgroundColor: getBoxColor(0, "green"),
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <Typography variant="subtitle2">CERTIFIED</Typography>
            <Typography variant="body2">TILL DATE</Typography>
            <Typography variant="h4">
              {values.certified.toFixed(2)} B
            </Typography>
          </Box>

          {/* PAID */}
          <Box
            sx={{
              backgroundColor: getBoxColor(0, "green"),
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <Typography variant="subtitle2">PAID</Typography>
            <Typography variant="body2">TILL DATE</Typography>
            <Typography variant="h4">{values.paid.toFixed(2)} B</Typography>
          </Box>
        </Box>

        {/* BOTTOM ROW (Plan %, Actual %) */}
        <Box
          sx={{
            gridColumn: "2 / 3",
            gridRow: "2 / 3",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          {/* PLAN % */}
          <Box
            sx={{
              backgroundColor: getBoxColor(0, "orange"),
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <Typography variant="subtitle2">PLAN %</Typography>
            <Typography variant="body2">TILL DATE</Typography>
            <Typography variant="h3">{values.planPercent}%</Typography>
          </Box>

          {/* ACTUAL % */}
          <Box
            sx={{
              backgroundColor: "#F5F5F5",
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            <Typography variant="subtitle2">ACTUAL %</Typography>
            <Typography variant="body2">TILL DATE</Typography>
            <Typography variant="h3">{values.actualPercent}%</Typography>
          </Box>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ marginBottom: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Box
                sx={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#8CB971",
                }}
              />
              <Typography variant="body2">90% to 100%</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Box
                sx={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#F4A261",
                }}
              />
              <Typography variant="body2">75% to 89%</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Box
                sx={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#2F80ED",
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
          backgroundColor: "#000",
          color: "white",
          padding: "15px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        PERFORMANCE EFFICIENCY: {values.performanceEfficiency}%
      </Paper>
    </Box>
  );
};

export default ProgressUpdate;
