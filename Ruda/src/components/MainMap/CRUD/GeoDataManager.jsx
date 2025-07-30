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
        // Parse JSON fields to arrays
        firms: Array.isArray(row.firms) ? row.firms : [],
        scope_of_work: Array.isArray(row.scope_of_work)
          ? row.scope_of_work
          : [],
        physical_chart: Array.isArray(row.physical_chart)
          ? row.physical_chart
          : [],
        financial_chart: Array.isArray(row.financial_chart)
          ? row.financial_chart
          : [],
        kpi_chart: Array.isArray(row.kpi_chart) ? row.kpi_chart : [],
        curve_chart: Array.isArray(row.curve_chart) ? row.curve_chart : [],
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
      // Arrays are already in the correct format, just ensure they're arrays
      if (Array.isArray(parsed[field])) {
        // Filter out empty entries
        parsed[field] = parsed[field].filter((item) => {
          if (typeof item === "object" && item !== null) {
            return Object.values(item).some(
              (value) => value && value.toString().trim() !== ""
            );
          }
          return false;
        });
      } else {
        parsed[field] = [];
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

  // Dynamic form builders for JSON fields
  const addItemToArray = (fieldName, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], newItem],
    }));
  };

  const removeItemFromArray = (fieldName, index) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  const updateItemInArray = (fieldName, index, updatedItem) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) =>
        i === index ? updatedItem : item
      ),
    }));
  };

  // Firms builder: {img, name, title}
  const renderFirmsBuilder = () => {
    const firms = formData.firms || [];

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
          Firms
        </Typography>
        {firms.map((firm, index) => (
          <Box
            key={index}
            sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Image Path"
                  value={firm.img || ""}
                  onChange={(e) =>
                    updateItemInArray("firms", index, {
                      ...firm,
                      img: e.target.value,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Name"
                  value={firm.name || ""}
                  onChange={(e) =>
                    updateItemInArray("firms", index, {
                      ...firm,
                      name: e.target.value,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Title"
                  value={firm.title || ""}
                  onChange={(e) =>
                    updateItemInArray("firms", index, {
                      ...firm,
                      title: e.target.value,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <IconButton
                  onClick={() => removeItemFromArray("firms", index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            addItemToArray("firms", { img: "", name: "", title: "" })
          }
          variant="outlined"
          size="small"
        >
          Add Firm
        </Button>
      </Box>
    );
  };

  // Scope of Work builder: {name, value}
  const renderScopeOfWorkBuilder = () => {
    const scopeItems = formData.scope_of_work || [];

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
          Scope of Work
        </Typography>
        {scopeItems.map((item, index) => (
          <Box
            key={index}
            sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Work Name"
                  value={item.name || ""}
                  onChange={(e) =>
                    updateItemInArray("scope_of_work", index, {
                      ...item,
                      name: e.target.value,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={item.value || ""}
                  onChange={(e) =>
                    updateItemInArray("scope_of_work", index, {
                      ...item,
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <IconButton
                  onClick={() => removeItemFromArray("scope_of_work", index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            addItemToArray("scope_of_work", { name: "", value: 0 })
          }
          variant="outlined"
          size="small"
        >
          Add Scope Item
        </Button>
      </Box>
    );
  };

  // Physical Chart builder: {month, actual, planned}
  const renderPhysicalChartBuilder = () => {
    const chartItems = formData.physical_chart || [];

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
          Physical Chart
        </Typography>
        {chartItems.map((item, index) => (
          <Box
            key={index}
            sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Month"
                  value={item.month || ""}
                  onChange={(e) =>
                    updateItemInArray("physical_chart", index, {
                      ...item,
                      month: e.target.value,
                    })
                  }
                  size="small"
                  placeholder="e.g., Jul-24"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Actual"
                  type="number"
                  value={item.actual || ""}
                  onChange={(e) =>
                    updateItemInArray("physical_chart", index, {
                      ...item,
                      actual: parseFloat(e.target.value) || 0,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Planned"
                  type="number"
                  value={item.planned || ""}
                  onChange={(e) =>
                    updateItemInArray("physical_chart", index, {
                      ...item,
                      planned: parseFloat(e.target.value) || 0,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <IconButton
                  onClick={() => removeItemFromArray("physical_chart", index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            addItemToArray("physical_chart", {
              month: "",
              actual: 0,
              planned: 0,
            })
          }
          variant="outlined"
          size="small"
        >
          Add Chart Data
        </Button>
      </Box>
    );
  };

  // Financial Chart builder: {name, value}
  const renderFinancialChartBuilder = () => {
    const chartItems = formData.financial_chart || [];

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
          Financial Chart
        </Typography>
        {chartItems.map((item, index) => (
          <Box
            key={index}
            sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Name"
                  value={item.name || ""}
                  onChange={(e) =>
                    updateItemInArray("financial_chart", index, {
                      ...item,
                      name: e.target.value,
                    })
                  }
                  size="small"
                  placeholder="e.g., Contract Amount"
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={item.value || ""}
                  onChange={(e) =>
                    updateItemInArray("financial_chart", index, {
                      ...item,
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <IconButton
                  onClick={() => removeItemFromArray("financial_chart", index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            addItemToArray("financial_chart", { name: "", value: 0 })
          }
          variant="outlined"
          size="small"
        >
          Add Financial Data
        </Button>
      </Box>
    );
  };

  // KPI Chart builder: {name, value}
  const renderKpiChartBuilder = () => {
    const chartItems = formData.kpi_chart || [];

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
          KPI Chart
        </Typography>
        {chartItems.map((item, index) => (
          <Box
            key={index}
            sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Name"
                  value={item.name || ""}
                  onChange={(e) =>
                    updateItemInArray("kpi_chart", index, {
                      ...item,
                      name: e.target.value,
                    })
                  }
                  size="small"
                  placeholder="e.g., Planned"
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={item.value || ""}
                  onChange={(e) =>
                    updateItemInArray("kpi_chart", index, {
                      ...item,
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <IconButton
                  onClick={() => removeItemFromArray("kpi_chart", index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() => addItemToArray("kpi_chart", { name: "", value: 0 })}
          variant="outlined"
          size="small"
        >
          Add KPI Data
        </Button>
      </Box>
    );
  };

  // Curve Chart builder: {name, value}
  const renderCurveChartBuilder = () => {
    const chartItems = formData.curve_chart || [];

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
          Curve Chart
        </Typography>
        {chartItems.map((item, index) => (
          <Box
            key={index}
            sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Name"
                  value={item.name || ""}
                  onChange={(e) =>
                    updateItemInArray("curve_chart", index, {
                      ...item,
                      name: e.target.value,
                    })
                  }
                  size="small"
                  placeholder="e.g., S-Curve"
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={item.value || ""}
                  onChange={(e) =>
                    updateItemInArray("curve_chart", index, {
                      ...item,
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <IconButton
                  onClick={() => removeItemFromArray("curve_chart", index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() => addItemToArray("curve_chart", { name: "", value: 0 })}
          variant="outlined"
          size="small"
        >
          Add Curve Data
        </Button>
      </Box>
    );
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
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    mt: 4,
                    color: "#1976d2",
                    fontWeight: "bold",
                    borderBottom: "2px solid #1976d2",
                    paddingBottom: 1,
                  }}
                >
                  Additional Data
                </Typography>

                <Grid container spacing={3}>
                  {/* Firms Section */}
                  <Grid item xs={12} md={6}>
                    {renderFirmsBuilder()}
                  </Grid>

                  {/* Scope of Work Section */}
                  <Grid item xs={12} md={6}>
                    {renderScopeOfWorkBuilder()}
                  </Grid>

                  {/* Physical Chart Section */}
                  <Grid item xs={12} md={6}>
                    {renderPhysicalChartBuilder()}
                  </Grid>

                  {/* Financial Chart Section */}
                  <Grid item xs={12} md={6}>
                    {renderFinancialChartBuilder()}
                  </Grid>

                  {/* KPI Chart Section */}
                  <Grid item xs={12} md={6}>
                    {renderKpiChartBuilder()}
                  </Grid>

                  {/* Curve Chart Section */}
                  <Grid item xs={12} md={6}>
                    {renderCurveChartBuilder()}
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
