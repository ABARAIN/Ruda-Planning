import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Refresh,
  Search,
  ExpandMore,
  Save,
  Cancel,
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/portfoliocrud";

const numberKeys = new Set([
  "dev_residential_pct",
  "dev_commercial_pct",
  "dev_industrial_pct",
  "dev_mixed_use_pct",
  "dev_institutional_pct",
  "exp_fy22_23_b",
  "exp_fy23_24_b",
  "exp_fy24_25_b",
  "exp_fy25_26_b",
  "exp_fy26_27_b",
  "financial_total_budget",
  "financial_utilized_budget",
  "financial_remaining_budget",
  "metric_total_development_budget_pkr",
  "metric_overall_duration_years",
  "metric_total_area_acres",
  "metric_total_projects",
  "progress_planned_pct",
  "progress_actual_pct",
  "timeline_elapsed_years",
  "timeline_remaining_years",
  "budget_planned_till_date_b",
  "budget_certified_till_date_b",
  "budget_expenditure_till_date_b",
  "sustainability_river_channelization_km",
  "sustainability_barrages_count",
  "sustainability_afforestation_acres",
]);

const colorKeys = new Set([
  "dev_residential_color",
  "dev_commercial_color",
  "dev_industrial_color",
  "dev_mixed_use_color",
  "dev_institutional_color",
  "financial_total_budget_color",
  "financial_utilized_budget_color",
  "financial_remaining_budget_color",
]);

const fieldGroups = [
  {
    title: "General",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "master_plan_image_url", label: "Master Plan Image URL", type: "text" },
    ],
  },
  {
    title: "Development Components",
    fields: [
      { key: "dev_residential_pct", label: "Residential %", type: "number" },
      { key: "dev_residential_color", label: "Residential Color", type: "color" },
      { key: "dev_commercial_pct", label: "Commercial %", type: "number" },
      { key: "dev_commercial_color", label: "Commercial Color", type: "color" },
      { key: "dev_industrial_pct", label: "Industrial %", type: "number" },
      { key: "dev_industrial_color", label: "Industrial Color", type: "color" },
      { key: "dev_mixed_use_pct", label: "Mixed Use %", type: "number" },
      { key: "dev_mixed_use_color", label: "Mixed Use Color", type: "color" },
      { key: "dev_institutional_pct", label: "Institutional %", type: "number" },
      { key: "dev_institutional_color", label: "Institutional Color", type: "color" },
    ],
  },
  {
    title: "Year-wise Expenditure (B)",
    fields: [
      { key: "exp_fy22_23_b", label: "FY22-23", type: "number" },
      { key: "exp_fy23_24_b", label: "FY23-24", type: "number" },
      { key: "exp_fy24_25_b", label: "FY24-25", type: "number" },
      { key: "exp_fy25_26_b", label: "FY25-26", type: "number" },
      { key: "exp_fy26_27_b", label: "FY26-27", type: "number" },
    ],
  },
  {
    title: "Financial Overview (PKR)",
    fields: [
      { key: "financial_total_budget", label: "Total Budget", type: "number" },
      { key: "financial_total_budget_color", label: "Total Budget Color", type: "color" },
      { key: "financial_utilized_budget", label: "Utilized Budget", type: "number" },
      { key: "financial_utilized_budget_color", label: "Utilized Budget Color", type: "color" },
      { key: "financial_remaining_budget", label: "Remaining Budget", type: "number" },
      { key: "financial_remaining_budget_color", label: "Remaining Budget Color", type: "color" },
    ],
  },
  {
    title: "Key Metrics",
    fields: [
      { key: "metric_total_development_budget_pkr", label: "Total Development Budget (PKR)", type: "number" },
      { key: "metric_overall_duration_years", label: "Overall Duration (Years)", type: "number" },
      { key: "metric_total_area_acres", label: "Total Area (Acres)", type: "number" },
      { key: "metric_total_projects", label: "Total Projects", type: "number" },
    ],
  },
  {
    title: "Progress (%)",
    fields: [
      { key: "progress_planned_pct", label: "Planned %", type: "number" },
      { key: "progress_actual_pct", label: "Actual %", type: "number" },
    ],
  },
  {
    title: "Timeline",
    fields: [
      { key: "timeline_start_label", label: "Start Label", type: "text" },
      { key: "timeline_mid_label", label: "Mid Label", type: "text" },
      { key: "timeline_end_label", label: "End Label", type: "text" },
      { key: "timeline_elapsed_years", label: "Elapsed Years", type: "number" },
      { key: "timeline_remaining_years", label: "Remaining Years", type: "number" },
    ],
  },
  {
    title: "FY24-25 Budget Status (B)",
    fields: [
      { key: "budget_planned_till_date_b", label: "Planned Till Date", type: "number" },
      { key: "budget_certified_till_date_b", label: "Certified Till Date", type: "number" },
      { key: "budget_expenditure_till_date_b", label: "Expenditure Till Date", type: "number" },
    ],
  },
  {
    title: "Sustainability",
    fields: [
      { key: "sustainability_river_channelization_km", label: "River Channelization (KM)", type: "number" },
      { key: "sustainability_barrages_count", label: "Barrages", type: "number" },
      { key: "sustainability_swm_text", label: "Solid Waste Management", type: "text" },
      { key: "sustainability_afforestation_acres", label: "Afforestation (Acres)", type: "number" },
      { key: "sustainability_trunk_infrastructure_text", label: "Trunk Infrastructure", type: "text" },
      { key: "sustainability_dry_utilities_text", label: "Dry Utilities", type: "text" },
    ],
  },
];

function coercePayload(p) {
  const out = { ...p };
  Object.keys(out).forEach((k) => {
    if (numberKeys.has(k)) {
      out[k] = out[k] === "" || out[k] === null || out[k] === undefined ? null : Number(out[k]);
    }
  });
  return out;
}

export default function PortfolioAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [toast, setToast] = useState({ open: false, type: "success", msg: "" });

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) => `${r.title ?? ""}`.toLowerCase().includes(q) || `${r.id}`.includes(q));
  }, [rows, search]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setRows(Array.isArray(json) ? json : []);
    } catch (e) {
      setToast({ open: true, type: "error", msg: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  }

  function onAdd() {
    setMode("create");
    setSelectedId(null);
    const empty = {};
    fieldGroups.forEach((g) =>
      g.fields.forEach((f) => {
        empty[f.key] = colorKeys.has(f.key) ? "#3b82f6" : "";
      })
    );
    empty.title = "RUDA DEVELOPMENT PORTFOLIO";
    setForm(empty);
    setOpen(true);
  }

  function onEdit(row) {
    setMode("edit");
    setSelectedId(row.id);
    const copy = { ...row };
    Object.keys(copy).forEach((k) => {
      if (copy[k] === null || copy[k] === undefined) copy[k] = "";
    });
    setForm(copy);
    setOpen(true);
  }

  async function onDelete(row) {
    if (!confirm(`Delete record #${row.id}?`)) return;
    try {
      const res = await fetch(`${API_URL}/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setToast({ open: true, type: "success", msg: "Deleted" });
      await load();
    } catch {
      setToast({ open: true, type: "error", msg: "Delete failed" });
    }
  }

  async function onSave() {
    const payload = coercePayload(form);
    try {
      const res = await fetch(mode === "create" ? API_URL : `${API_URL}/${selectedId}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setToast({ open: true, type: "success", msg: mode === "create" ? "Created" : "Updated" });
      setOpen(false);
      await load();
    } catch {
      setToast({ open: true, type: "error", msg: "Save failed" });
    }
  }

  function Field({ def }) {
    const v = form[def.key] ?? "";
    const common = {
      size: "small",
      fullWidth: true,
      value: v,
      onChange: (e) => setForm((s) => ({ ...s, [def.key]: e.target.value })),
    };
    if (def.type === "number") {
      return <TextField {...common} label={def.label} type="number" inputProps={{ step: "any" }} />;
    }
    if (def.type === "color") {
      return (
        <TextField
          {...common}
          label={def.label}
          type="color"
          InputLabelProps={{ shrink: true }}
          sx={{ "& input": { height: 40, padding: 0 } }}
        />
      );
    }
    return <TextField {...common} label={def.label} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={3}>
        <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Portfolio CRUD
          </Typography>
          <TextField
            size="small"
            placeholder="Search by title or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={load}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
            New
          </Button>
        </Toolbar>
        <Divider />
        {loading ? (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Planned FY24-25 (B)</TableCell>
                    <TableCell>Certified (B)</TableCell>
                    <TableCell>Expenditure (B)</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paged.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.title}</TableCell>
                      <TableCell>{r.budget_planned_till_date_b}</TableCell>
                      <TableCell>{r.budget_certified_till_date_b}</TableCell>
                      <TableCell>{r.budget_expenditure_till_date_b}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton onClick={() => onEdit(r)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => onDelete(r)}>
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!paged.length && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{mode === "create" ? "New Portfolio" : `Edit #${selectedId}`}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {fieldGroups.map((group, gi) => (
              <Accordion key={gi} defaultExpanded={gi <= 1}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight={600}>{group.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2} direction="row" flexWrap="wrap" useFlexGap>
                    {group.fields.map((f) => (
                      <Box key={f.key} sx={{ flex: "1 1 260px", minWidth: 240 }}>
                        <Field def={f} />
                      </Box>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<Cancel />} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={<Save />} onClick={onSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.type} sx={{ width: "100%" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
