import React from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const JSONData = ({ formData, setFormData }) => {
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
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "rgba(76, 175, 80, 0.02)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
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
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "rgba(76, 175, 80, 0.05)",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#1e3a5f",
                      fontWeight: "500",
                    },
                  }}
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
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "rgba(76, 175, 80, 0.05)",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#1e3a5f",
                      fontWeight: "500",
                    },
                  }}
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
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "rgba(76, 175, 80, 0.05)",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#1e3a5f",
                      fontWeight: "500",
                    },
                  }}
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
          sx={{
            borderRadius: "8px",
            borderColor: "#4caf50",
            color: "#4caf50",
            "&:hover": {
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              borderColor: "#66bb6a",
            },
          }}
        >
          Add Firm
        </Button>
      </Box>
    );
  };

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
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "rgba(76, 175, 80, 0.02)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
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
                  value={item.value || ""}
                  onChange={(e) =>
                    updateItemInArray("scope_of_work", index, {
                      ...item,
                      value: e.target.value,
                    })
                  }
                  size="small"
                  placeholder="e.g., Description or details"
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
            addItemToArray("scope_of_work", { name: "", value: "" })
          }
          variant="outlined"
          size="small"
        >
          Add Scope Item
        </Button>
      </Box>
    );
  };

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
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "rgba(76, 175, 80, 0.02)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Name"
                  value={item.name || ""}
                  onChange={(e) =>
                    updateItemInArray("physical_chart", index, {
                      ...item,
                      name: e.target.value,
                    })
                  }
                  size="small"
                  placeholder="e.g., Progress"
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={item.value || ""}
                  onChange={(e) =>
                    updateItemInArray("physical_chart", index, {
                      ...item,
                      value: parseFloat(e.target.value) || 0,
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
            addItemToArray("physical_chart", { name: "", value: 0 })
          }
          variant="outlined"
          size="small"
        >
          Add Chart Data
        </Button>
      </Box>
    );
  };

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
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "rgba(76, 175, 80, 0.02)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
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
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "rgba(76, 175, 80, 0.02)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
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
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "rgba(76, 175, 80, 0.02)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Month"
                  value={item.month || ""}
                  onChange={(e) =>
                    updateItemInArray("curve_chart", index, {
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
                    updateItemInArray("curve_chart", index, {
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
                    updateItemInArray("curve_chart", index, {
                      ...item,
                      planned: parseFloat(e.target.value) || 0,
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
          onClick={() =>
            addItemToArray("curve_chart", { month: "", actual: 0, planned: 0 })
          }
          variant="outlined"
          size="small"
        >
          Add Curve Data
        </Button>
      </Box>
    );
  };

  return (
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
          Additional Data
        </Typography>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {renderFirmsBuilder()}
        </Grid>
        <Grid item xs={12}>
          {renderScopeOfWorkBuilder()}
        </Grid>
        <Grid item xs={12}>
          {renderPhysicalChartBuilder()}
        </Grid>
        <Grid item xs={12}>
          {renderFinancialChartBuilder()}
        </Grid>
        <Grid item xs={12}>
          {renderKpiChartBuilder()}
        </Grid>
        <Grid item xs={12}>
          {renderCurveChartBuilder()}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default JSONData;
