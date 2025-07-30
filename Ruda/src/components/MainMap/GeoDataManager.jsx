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
    firms: "",
    physical_chart: "",
    financial_chart: "",
    kpi_chart: "",
    curve_chart: "",
    category: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/all");
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

  const handleOpenDialog = (row = null) => {
    if (row) {
      setEditingRow(row);
      setFormData({
        ...initializeFormData(),
        ...row,
        // Parse JSON fields
        firms: row.firms ? JSON.stringify(row.firms, null, 2) : "",
        scope_of_work: row.scope_of_work
          ? JSON.stringify(row.scope_of_work, null, 2)
          : "",
        physical_chart: row.physical_chart
          ? JSON.stringify(row.physical_chart, null, 2)
          : "",
        financial_chart: row.financial_chart
          ? JSON.stringify(row.financial_chart, null, 2)
          : "",
        kpi_chart: row.kpi_chart ? JSON.stringify(row.kpi_chart, null, 2) : "",
        curve_chart: row.curve_chart
          ? JSON.stringify(row.curve_chart, null, 2)
          : "",
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
      if (parsed[field] && typeof parsed[field] === "string") {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch (e) {
          console.warn(`Invalid JSON in ${field}:`, e);
          parsed[field] = null;
        }
      }
    });

    return parsed;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const parsedData = parseJsonFields(formData);

      if (editingRow) {
        // Update existing record
        await axios.put(
          `http://localhost:5000/api/manage/all/${editingRow.gid}`,
          parsedData
        );
        showSnackbar("Record updated successfully");
      } else {
        // Create new record
        await axios.post("http://localhost:5000/api/manage/all", parsedData);
        showSnackbar("Record created successfully");
      }

      handleCloseDialog();
      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error saving record:", error);
      showSnackbar("Error saving record", "error");
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
        PaperProps={{ sx: { maxHeight: "90vh" } }}
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

                <Grid container spacing={2}>
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

                <Grid container spacing={2}>
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

                <Grid container spacing={2}>
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

              {/* JSON Data Section */}
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
                  Additional Data (JSON Format)
                </Typography>

                <Grid container spacing={2}>
                  {/* JSON fields in equal sizes */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Firms (JSON)"
                      value={formData.firms || ""}
                      onChange={(e) =>
                        handleInputChange("firms", e.target.value)
                      }
                      multiline
                      rows={3}
                      variant="outlined"
                      size="small"
                      helperText="Example: [{'img': '/Ruda.jpg', 'name': 'RUDA', 'title': 'Employer'}]"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Scope of Work (JSON)"
                      value={formData.scope_of_work || ""}
                      onChange={(e) =>
                        handleInputChange("scope_of_work", e.target.value)
                      }
                      multiline
                      rows={3}
                      variant="outlined"
                      size="small"
                      helperText="Example: [{'name': 'Earth Work', 'value': 100}]"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Physical Chart (JSON)"
                      value={formData.physical_chart || ""}
                      onChange={(e) =>
                        handleInputChange("physical_chart", e.target.value)
                      }
                      multiline
                      rows={3}
                      variant="outlined"
                      size="small"
                      helperText="Example: [{'month': 'Jul-24', 'actual': 1, 'planned': 2}]"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Financial Chart (JSON)"
                      value={formData.financial_chart || ""}
                      onChange={(e) =>
                        handleInputChange("financial_chart", e.target.value)
                      }
                      multiline
                      rows={3}
                      variant="outlined"
                      size="small"
                      helperText="Example: [{'name': 'Contract Amount', 'value': 2520}]"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="KPI Chart (JSON)"
                      value={formData.kpi_chart || ""}
                      onChange={(e) =>
                        handleInputChange("kpi_chart", e.target.value)
                      }
                      multiline
                      rows={3}
                      variant="outlined"
                      size="small"
                      helperText="Example: [{'name': 'Planned', 'value': 76}]"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Curve Chart (JSON)"
                      value={formData.curve_chart || ""}
                      onChange={(e) =>
                        handleInputChange("curve_chart", e.target.value)
                      }
                      multiline
                      rows={3}
                      variant="outlined"
                      size="small"
                      helperText="Example: [{'name': 'S-Curve', 'value': 50}]"
                    />
                  </Grid>
                </Grid>
              </Grid>
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
