import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const formatValue = (val) => {
  if (Array.isArray(val)) return val.map(formatValue).join(", ");
  if (val && typeof val === "object") return JSON.stringify(val, null, 2); // Pretty JSON
  return val !== null && val !== undefined ? val.toString() : "";
};

const GeoDataManager = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/all")
      .then((res) => {
        const features = res.data.features || [];
        const propertiesList = features.map((f) => f.properties || {});
        const allKeys = [
          ...new Set(propertiesList.flatMap((obj) => Object.keys(obj))),
        ];
        setColumns(allKeys);
        setRows(propertiesList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
      >
        Project Data Viewer
      </Typography>

      <Paper elevation={3} sx={{ p: 2 }}>
        <TableContainer sx={{ maxHeight: "80vh", overflow: "auto" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((col, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    }}
                  >
                    {col.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} hover>
                  {columns.map((col, j) => (
                    <TableCell key={j} sx={{ whiteSpace: "pre-wrap" }}>
                      {formatValue(row[col])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default GeoDataManager;
