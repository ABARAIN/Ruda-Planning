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

// RUDA Theme Styles
const rudaStyles = `
  .ruda-geo-container {
    width: 100%;
    height: 100vh;
    font-family: Arial, sans-serif;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }

  .ruda-geo-header {
    background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6b 100%);
    color: white;
    padding: 16px 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-bottom: 3px solid #4caf50;
  }

  .ruda-geo-content {
    flex: 1;
    overflow: auto;
    padding: 0px;
  }

  .ruda-geo-paper {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 0px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border: 1px solid #e0e0e0;
  }

  .ruda-geo-table-header {
    background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6b 100%);
    color: white;
  }

  .ruda-geo-table-cell {
    border-bottom: 1px solid #e0e0e0;
    transition: all 0.2s ease;
  }

  .ruda-geo-table-row:hover {
    background: linear-gradient(135deg, #f0f8ff 0%, #e8f4fd 100%);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .ruda-geo-button-primary {
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    transition: all 0.3s ease;
  }

  .ruda-geo-button-primary:hover {
    background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  .ruda-geo-section-header {
    background: linear-gradient(135deg, #e8f4fd 0%, #f1f8ff 100%);
    border-left: 4px solid #1976d2;
    padding: 12px 16px;
    margin: 16px 0 8px 0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .ruda-geo-dialog {
    border-radius: 16px;
  }

  .ruda-geo-dialog-title {
    background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6b 100%);
    color: white;
    margin: 0;
    padding: 20px 24px;
  }

  .ruda-geo-dialog-content {
    padding: 24px;
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  }

  .ruda-geo-text-field {
    margin-bottom: 16px;
  }

  .ruda-geo-text-field .MuiOutlinedInput-root {
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .ruda-geo-text-field .MuiOutlinedInput-root:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .ruda-geo-text-field .MuiOutlinedInput-root.Mui-focused {
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
  }

  .ruda-geo-action-button {
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .ruda-geo-action-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .ruda-geo-chip {
    border-radius: 16px;
    font-weight: 500;
  }

  .ruda-geo-loading {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = rudaStyles;
  document.head.appendChild(styleSheet);
}

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
        size="small"
        className="ruda-geo-text-field"
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
            "&.Mui-focused": {
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#1e3a5f",
            fontWeight: "500",
          },
        }}
      />
    );
  };

  if (loading) {
    return (
      <div className="ruda-geo-loading">
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            size={60}
            sx={{
              color: "#4caf50",
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "#1e3a5f",
              fontWeight: "bold",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Loading Project Data...
          </Typography>
        </Box>
      </div>
    );
  }

  return (
    <div className="ruda-geo-container">
      <div className="ruda-geo-header">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "white",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            PROJECT DATA MANAGER
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            className="ruda-geo-button-primary"
            sx={{
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "14px",
            }}
          >
            Add New Project
          </Button>
        </Box>
      </div>
      <div className="ruda-geo-content">
        <Paper elevation={0} className="ruda-geo-paper" sx={{ p: 3 }}>
          <TableContainer sx={{ maxHeight: "83vh", overflow: "auto" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    className="ruda-geo-table-header"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      minWidth: 140,
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      fontSize: "13px",
                    }}
                  >
                    Actions
                  </TableCell>
                  {columns.map((col, i) => (
                    <TableCell
                      key={i}
                      className="ruda-geo-table-header"
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        minWidth: 150,
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        fontSize: "13px",
                      }}
                    >
                      {col.toUpperCase()}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow
                    key={i}
                    hover
                    className="ruda-geo-table-row"
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    <TableCell className="ruda-geo-table-cell">
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(row)}
                            className="ruda-geo-action-button"
                            sx={{
                              color: "#1976d2",
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.1)",
                              },
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Project">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(row)}
                            className="ruda-geo-action-button"
                            sx={{
                              color: "#4caf50",
                              "&:hover": {
                                backgroundColor: "rgba(76, 175, 80, 0.1)",
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Project">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row.gid)}
                            className="ruda-geo-action-button"
                            sx={{
                              color: "#f44336",
                              "&:hover": {
                                backgroundColor: "rgba(244, 67, 54, 0.1)",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    {columns.map((col, j) => (
                      <TableCell
                        key={j}
                        className="ruda-geo-table-cell"
                        sx={{
                          whiteSpace: "pre-wrap",
                          maxWidth: 200,
                          fontSize: "12px",
                          fontWeight: "500",
                          color: "#2c3e50",
                        }}
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
          className="ruda-geo-dialog"
          PaperProps={{
            sx: {
              maxHeight: "90vh",
              borderRadius: "16px",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            className="ruda-geo-dialog-title"
            sx={{
              background: "linear-gradient(135deg, #1e3a5f 0%, #2c4a6b 100%)",
              color: "white",
              margin: 0,
              padding: "20px 24px",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {editingRow ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogContent
            className="ruda-geo-dialog-content"
            sx={{
              padding: "24px",
              background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
            }}
          >
            <Box sx={{ pt: 0 }}>
              <Grid container spacing={3}>
                {/* Basic Information Section */}
                <Grid item xs={12}>
                  <div className="ruda-geo-section-header">
                    <Typography
                      variant="h6"
                      sx={{
                        margin: 0,
                        color: "#1e3a5f",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      Basic Information
                    </Typography>
                  </div>

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
                  <div className="ruda-geo-section-header">
                    <Typography
                      variant="h6"
                      sx={{
                        margin: 0,
                        color: "#1e3a5f",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      Area Information
                    </Typography>
                  </div>

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
                  <div className="ruda-geo-section-header">
                    <Typography
                      variant="h6"
                      sx={{
                        margin: 0,
                        color: "#1e3a5f",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      Financial Information
                    </Typography>
                  </div>

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
                  <div className="ruda-geo-section-header">
                    <Typography
                      variant="h6"
                      sx={{
                        margin: 0,
                        color: "#1e3a5f",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      Timeline Information
                    </Typography>
                  </div>

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
                        label=" Firms (JSON)"
                        value={formData.firms || ""}
                        onChange={(e) =>
                          handleInputChange("firms", e.target.value)
                        }
                        multiline
                        rows={3}
                        variant="outlined"
                        size="small"
                        className="ruda-geo-text-field"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "rgba(76, 175, 80, 0.05)",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#1e3a5f",
                            fontWeight: "500",
                          },
                        }}
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
      </div>
    </div>
  );
};

export default GeoDataManager;
