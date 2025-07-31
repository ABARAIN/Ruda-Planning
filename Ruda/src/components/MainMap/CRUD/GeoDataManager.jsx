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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import axios from "axios";
import JSONData from "./JSONData";

const formatValue = (val) => {
  if (Array.isArray(val)) return val.map(formatValue).join(", ");
  if (val && typeof val === "object") return JSON.stringify(val, null, 2);
  return val !== null && val !== undefined ? val.toString() : "";
};

const GeoDataManager = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Initialize form data structure
  const initializeFormData = () => ({
    layer: "",
    map_name: "",
    name: "",
    area_sqkm: "",
    area_acres: "",
    ruda_phase: "",
    rtw_pkg: "",
    description: "",
    scope_of_work: "",
    land_available_pct: "",
    land_available_km: "",
    land_remaining_pct: "",
    land_remaining_km: "",
    awarded_cost: "",
    duration_months: "",
    commencement_date: "",
    completion_date: "",
    physical_actual_pct: "",
    work_done_million: "",
    certified_million: "",
    elapsed_months: "",
    // JSON fields as arrays for easier manipulation
    firms: [],
    scope_of_work: [],
    physical_chart: [],
    financial_chart: [],
    kpi_chart: [],
    curve_chart: [],
    category: "",
  });

  useEffect(() => {
    fetchData();
    // Test backend connection
    testBackendConnection();
  }, []);

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/all");
      console.log("✅ Backend connection successful");
      console.log("API Response structure:", {
        hasFeatures: !!response.data.features,
        featuresCount: response.data.features?.length || 0,
        sampleFeature: response.data.features?.[0]?.properties || null,
      });

      // Check how JSON fields are stored in the backend
      const sampleFeature = response.data.features?.[0]?.properties;
      if (sampleFeature) {
        console.log("🔍 JSON field analysis:");
        const jsonFields = [
          "firms",
          "scope_of_work",
          "physical_chart",
          "financial_chart",
          "kpi_chart",
          "curve_chart",
        ];
        jsonFields.forEach((field) => {
          if (sampleFeature[field]) {
            console.log(`${field}:`, {
              type: typeof sampleFeature[field],
              isArray: Array.isArray(sampleFeature[field]),
              value: sampleFeature[field],
            });
          }
        });
      }
    } catch (error) {
      console.error("❌ Backend connection failed:", error.message);
      console.error(
        "Make sure your backend server is running on http://localhost:5000"
      );
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/all");
      console.log("Fetched data:", res.data);

      const features = res.data.features || [];
      const propertiesList = features.map((f) => f.properties || {});
      const allKeys = [
        ...new Set(propertiesList.flatMap((obj) => Object.keys(obj))),
      ];
      setColumns(allKeys);
      setRows(propertiesList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      console.error("Error details:", err.response?.data);
      setLoading(false);
      showSnackbar("Error fetching data", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper function to safely parse JSON fields
  const parseJsonField = (field) => {
    if (Array.isArray(field)) {
      return field;
    }
    if (typeof field === "string" && field.trim() !== "") {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.warn("Failed to parse JSON field:", field, e);
        return [];
      }
    }
    return [];
  };

  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditingRow(row);
      setFormData({
        ...initializeFormData(),
        ...row,
        // Parse JSON fields to arrays with proper error handling
        firms: parseJsonField(row.firms),
        scope_of_work: parseJsonField(row.scope_of_work),
        physical_chart: parseJsonField(row.physical_chart),
        financial_chart: parseJsonField(row.financial_chart),
        kpi_chart: parseJsonField(row.kpi_chart),
        curve_chart: parseJsonField(row.curve_chart),
      });
    } else {
      setEditingRow(null);
      setFormData(initializeFormData());
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRow(null);
    setFormData(initializeFormData());
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ["name", "layer", "map_name"];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        showSnackbar(
          `${field.replace("_", " ").toUpperCase()} is required`,
          "error"
        );
        return false;
      }
    }
    return true;
  };

  const parseJsonFields = (data) => {
    const jsonFields = [
      "firms",
      "scope_of_work",
      "physical_chart",
      "financial_chart",
      "kpi_chart",
      "curve_chart",
    ];
    const parsed = { ...data };

    jsonFields.forEach((field) => {
      // Ensure arrays are properly formatted and filter out empty entries
      if (Array.isArray(parsed[field])) {
        // Filter out empty entries
        const filteredArray = parsed[field].filter((item) => {
          if (typeof item === "object" && item !== null) {
            return Object.values(item).some(
              (value) => value && value.toString().trim() !== ""
            );
          }
          return false;
        });

        // Convert to JSON string for backend compatibility
        // Most backends expect JSON fields as strings, not arrays
        if (filteredArray.length > 0) {
          try {
            parsed[field] = JSON.stringify(filteredArray);
          } catch (e) {
            console.error(`Error stringifying ${field}:`, e);
            parsed[field] = null;
          }
        } else {
          parsed[field] = null;
        }
      } else {
        parsed[field] = null;
      }
    });

    return parsed;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const parsedData = parseJsonFields(formData);

      // Log the data being sent for debugging
      console.log("Sending data to backend:", parsedData);
      console.log("JSON fields in data:", {
        firms: parsedData.firms,
        scope_of_work: parsedData.scope_of_work,
        physical_chart: parsedData.physical_chart,
        financial_chart: parsedData.financial_chart,
        kpi_chart: parsedData.kpi_chart,
        curve_chart: parsedData.curve_chart,
      });

      if (editingRow) {
        // Update existing record
        const response = await axios.put(
          `http://localhost:5000/api/manage/all/${editingRow.gid}`,
          parsedData
        );
        console.log("Update response:", response.data);
        showSnackbar("Record updated successfully");
      } else {
        // Create new record
        const response = await axios.post(
          "http://localhost:5000/api/manage/all",
          parsedData
        );
        console.log("Create response:", response.data);
        showSnackbar("Record created successfully");
      }

      handleCloseDialog();
      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error saving record:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Full error response:", error.response);

      // Show detailed error information
      let errorMessage = "Error saving record";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      showSnackbar(
        `${errorMessage} (Status: ${error.response?.status || "Unknown"})`,
        "error"
      );
    }
  };

  const handleDelete = async (gid) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/manage/all/${gid}`);
        showSnackbar("Record deleted successfully");
        fetchData(); // Refresh the data
      } catch (error) {
        console.error("Error deleting record:", error);
        showSnackbar("Error deleting record", "error");
      }
    }
  };

  const renderFormField = (
    field,
    label,
    type = "text",
    multiline = false,
    rows = 1
  ) => {
    const value = formData[field] || "";

    if (type === "select") {
      return (
        <FormControl fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select
            value={value}
            label={label}
            onChange={(e) => handleInputChange(field, e.target.value)}
          >
            <MenuItem value="Ruda Phase 1">Ruda Phase 1</MenuItem>
            <MenuItem value="Ruda Phase 2A">Ruda Phase 2A</MenuItem>
            <MenuItem value="Ruda Phase 2B">Ruda Phase 2B</MenuItem>
            <MenuItem value="Ruda Phase 3">Ruda Phase 3</MenuItem>
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        fullWidth
        label={label}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        type={type}
        multiline={multiline}
        rows={rows}
        variant="outlined"
      />
    );
  };

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Project Data Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: "#1976d2" }}
        >
          Add New Project
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 2 }}>
        <TableContainer sx={{ maxHeight: "70vh", overflow: "auto" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                  }}
                >
                  Actions
                </TableCell>
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
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(row)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(row.gid)}
                          sx={{ color: "error.main" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  {columns.map((col, j) => (
                    <TableCell
                      key={j}
                      sx={{ whiteSpace: "pre-wrap", maxWidth: 200 }}
                    >
                      {formatValue(row[col])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* CRUD Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { maxHeight: "90vh" } } }}
      >
        <DialogTitle>
          {editingRow ? "Edit Project" : "Add New Project"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              {/* Basic Information Section */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    color: "#1976d2",
                    fontWeight: "bold",
                    borderBottom: "2px solid #1976d2",
                    paddingBottom: 1,
                  }}
                >
                  Basic Information
                </Typography>

                <Grid container spacing={2} sx={{ width: "100%" }}>
                  {/* First row: Project Name, Layer, Map Name */}
                  <Grid item xs={12} md={4}>
                    {renderFormField("name", "Project Name")}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderFormField("layer", "Layer")}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderFormField("map_name", "Map Name")}
                  </Grid>

                  {/* Second row: Category, RUDA Phase, RTW Package */}
                  <Grid item xs={12} md={4}>
                    {renderFormField("category", "Category")}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderFormField("ruda_phase", "RUDA Phase", "select")}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderFormField("rtw_pkg", "RTW Package")}
                  </Grid>
                </Grid>
              </Grid>

              {/* Area Information Section */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    mt: 0,
                    color: "#1976d2",
                    fontWeight: "bold",
                    borderBottom: "2px solid #1976d2",
                    paddingBottom: 1,
                  }}
                >
                  Area Information
                </Typography>

                <Grid container spacing={2} sx={{ width: "100%" }}>
                  {/* First row: Area (sq km), Area (acres), Land Available (%) */}
                  <Grid item xs={12} md={4}>
                    {renderFormField("area_sqkm", "Area (sq km)", "number")}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderFormField("area_acres", "Area (acres)", "number")}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderFormField(
                      "land_available_pct",
                      "Land Available (%)",
                      "number"
                    )}
                  </Grid>

                  {/* Second row: Land Available (km), Land Remaining (%), Land Remaining (km) */}
                  <Grid item xs={12} md={4}>
                    {renderFormField(
                      "land_available_km",
                      "Land Available (km)",
                      "number"
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderFormField(
                      "land_remaining_pct",
                      "Land Remaining (%)",
                      "number"
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderFormField(
                      "land_remaining_km",
                      "Land Remaining (km)",
                      "number"
                    )}
                  </Grid>
                </Grid>
              </Grid>

              {/* Financial Information Section */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    mt: 0,
                    color: "#1976d2",
                    fontWeight: "bold",
                    borderBottom: "2px solid #1976d2",
                    paddingBottom: 1,
                  }}
                >
                  Financial Information
                </Typography>

                <Grid container spacing={2} sx={{ width: "100%" }}>
                  {/* First row: Awarded Cost, Work Done, Certified */}
                  <Grid item xs={12} md={4}>
                    {renderFormField(
                      "awarded_cost",
                      "Awarded Cost (Million)",
                      "number"
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderFormField(
                      "work_done_million",
                      "Work Done (Million)",
                      "number"
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderFormField(
                      "certified_million",
                      "Certified (Million)",
                      "number"
                    )}
                  </Grid>

                  {/* Second row: Physical Actual (%) */}
                  <Grid item xs={12} md={4}>
                    {renderFormField(
                      "physical_actual_pct",
                      "Physical Actual (%)",
                      "number"
                    )}
                  </Grid>
                </Grid>
              </Grid>

              {/* Timeline Information Section */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    mt: 0,
                    color: "#1976d2",
                    fontWeight: "bold",
                    borderBottom: "2px solid #1976d2",
                    paddingBottom: 1,
                  }}
                >
                  Timeline Information
                </Typography>

                <Grid container spacing={2}>
                  {/* Timeline fields in one row */}
                  <Grid item xs={12} md={3}>
                    {renderFormField(
                      "duration_months",
                      "Duration (Months)",
                      "number"
                    )}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    {renderFormField(
                      "elapsed_months",
                      "Elapsed (Months)",
                      "number"
                    )}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    {renderFormField(
                      "commencement_date",
                      "Commencement Date",
                      "date"
                    )}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    {renderFormField(
                      "completion_date",
                      "Completion Date",
                      "date"
                    )}
                  </Grid>
                </Grid>
              </Grid>

              {/* Description Section */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    mt: 0,
                    color: "#1976d2",
                    fontWeight: "bold",
                    borderBottom: "2px solid #1976d2",
                    paddingBottom: 1,
                  }}
                >
                  Description
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {renderFormField(
                      "description",
                      "Description",
                      "text",
                      true,
                      4
                    )}
                  </Grid>
                </Grid>
              </Grid>

              {/* Additional Data Section */}
              <JSONData formData={formData} setFormData={setFormData} />
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ bgcolor: "#1976d2" }}
          >
            {editingRow ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GeoDataManager;
