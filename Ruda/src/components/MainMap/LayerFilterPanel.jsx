import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const normalize = (str) =>
  (str || "")
    .toLowerCase()
    .replace(/ruda\s+/i, "")
    .trim();

const ColorSwatch = ({ color }) => (
  <span
    style={{
      display: "inline-block",
      width: 18,
      height: 18,
      borderRadius: 4,
      background: color,
      border: "1.5px solid #888",
      marginRight: 8,
      verticalAlign: "middle",
    }}
  />
);

const LayerFilterPanel = ({
  features = [],
  selectedPhases = [],
  setSelectedPhases,
  selectedPackages = [],
  setSelectedPackages,
  selectedProjects = [],
  setSelectedProjects,
  colorMap = {},
  onColorChange,
  onClose = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [openPhase, setOpenPhase] = useState(false);
  const [openPackage, setOpenPackage] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openProject, setOpenProject] = useState(false);

  const phaseOptions = useMemo(
    () => [
      ...new Set(
        features
          .filter((f) => f.properties?.name?.toLowerCase().startsWith("phase"))
          .map((f) => f.properties.name)
      ),
    ],
    [features]
  );

  const packageOptions = useMemo(
    () =>
      [
        ...new Set(
          features
            .filter(
              (f) =>
                f.properties?.name?.startsWith("RTW Package") &&
                f.properties?.ruda_phase &&
                selectedPhases.some(
                  (phase) =>
                    normalize(f.properties.ruda_phase) === normalize(phase)
                )
            )
            .map((f) => f.properties.name)
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [features, selectedPhases]
  );

  const categoryOptions = useMemo(() => {
    const categories = new Set();
    features
      .filter(
        (f) =>
          (f.properties?.name?.startsWith("RTW P") ||
            f.properties?.name === "11") &&
          f.properties?.rtw_pkg &&
          selectedPackages.includes(f.properties.rtw_pkg)
      )
      .forEach((f) => {
        if (f.properties?.category) {
          categories.add(f.properties.category);
        }
      });
    return Array.from(categories);
  }, [features, selectedPackages]);

  const projectOptions = useMemo(() => {
    return features
      .filter(
        (f) =>
          (f.properties?.name?.startsWith("RTW P") ||
            f.properties?.name === "11") &&
          f.properties?.rtw_pkg &&
          selectedPackages.includes(f.properties.rtw_pkg) &&
          selectedCategories.includes(f.properties?.category)
      )
      .map((f) => f.properties.name);
  }, [features, selectedPackages, selectedCategories]);

  const renderDropdown = (
    label,
    value,
    setValue,
    options,
    openState,
    setOpenState,
    allowColor = true
  ) => {
    const isAllSelected = options.length > 0 && value.length === options.length;

    const handleChange = (event) => {
      const selected = event.target.value;
      if (selected.includes("ALL")) {
        setValue(isAllSelected ? [] : options);
        setOpenState(false);
        return;
      }
      setValue(selected);
    };

    return (
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel sx={{ color: "#ccc" }}>{label}</InputLabel>
        <Select
          multiple
          open={openState}
          onOpen={() => setOpenState(true)}
          onClose={() => setOpenState(false)}
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                backgroundColor: "#121212",
                color: "#fff",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#000",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": { backgroundColor: "#222" },
                scrollbarColor: "#000 #222",
                scrollbarWidth: "thin",
              },
            },
          }}
          sx={{
            bgcolor: "#1a1a1a1d",
            color: "#ffffff",
            borderRadius: "8px",
            "& .MuiSvgIcon-root": { color: "#fff" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#555",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#555 !important",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#555 !important",
            },
          }}
        >
          <MenuItem value="ALL">
            <Checkbox
              checked={isAllSelected}
              indeterminate={value.length > 0 && value.length < options.length}
              sx={{ color: "#ffffff", "&.Mui-checked": { color: "#2196f3" } }}
            />
            <ListItemText primary="Select All" />
          </MenuItem>

          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              <Checkbox
                checked={value.includes(opt)}
                sx={{ color: "#ccc", "&.Mui-checked": { color: "#2196f3" } }}
              />
              {allowColor && <ColorSwatch color={colorMap[opt] || "#999"} />}
              <ListItemText primary={opt} />
              {allowColor && (
                <input
                  type="color"
                  value={colorMap[opt] || "#cccccc"}
                  onChange={(e) => onColorChange(opt, e.target.value)}
                  style={{
                    marginLeft: 10,
                    marginRight: 4,
                    width: 26,
                    height: 26,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                  onClick={(e) => e.stopPropagation()}
                  title="Change color"
                />
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <Box
      sx={{
        width: isMobile ? 220 : 300,
        height: isMobile ? "400%" : "100%",
        maxHeight: isMobile ? "100vh" : "100%",
        bgcolor: "#1a1a1a1d",
        color: "#fff",
        px: 2,
        py: 2,
        overflowY: "auto",
        position: "relative",
        border: "1px solid rgba(255,255,255,0.1)",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "rgba(255,255,255,0.05)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: "3px",
        },
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.2) rgba(255,255,255,0.05)",
      }}
    >
      {isMobile && (
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#fff",
            backgroundColor: "#444",
            "&:hover": { backgroundColor: "#666" },
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      )}

      <Typography variant="h5" fontWeight="normal" sx={{ mb: 2, ml: 1, mt: 1 }}>
        <span style={{ color: "white" }}>Layer Filters</span>
      </Typography>

      {renderDropdown(
        "Phases",
        selectedPhases,
        setSelectedPhases,
        phaseOptions,
        openPhase,
        setOpenPhase
      )}
      {renderDropdown(
        "Packages",
        selectedPackages,
        setSelectedPackages,
        packageOptions,
        openPackage,
        setOpenPackage
      )}
      {renderDropdown(
        "Category",
        selectedCategories,
        setSelectedCategories,
        categoryOptions,
        openCategory,
        setOpenCategory,
        false
      )}

      <FormControl
        fullWidth
        sx={{
          mt: 2,
          color: "#fff",
          "& .MuiSvgIcon-root": { color: "#fff" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#555",
            borderRadius: "8px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#555",
          },
        }}
      >
        <InputLabel sx={{ color: "#ccc" }}>Projects</InputLabel>
        <Select
          multiple
          open={openProject}
          onOpen={() => setOpenProject(true)}
          onClose={() => setOpenProject(false)}
          value={selectedProjects}
          onChange={(e) => {
            const selected = e.target.value;
            const isAllSelected =
              projectOptions.length > 0 &&
              selectedProjects.length === projectOptions.length;

            if (selected.includes("ALL")) {
              setSelectedProjects(isAllSelected ? [] : projectOptions);
              setOpenProject(false);
              return;
            }
            setSelectedProjects(selected);
          }}
          input={<OutlinedInput label="Projects" />}
          renderValue={(selected) => selected.join(", ")}
          sx={{
            color: "#fff",
            "& .MuiSvgIcon-root": { color: "#fff" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                backgroundColor: "#121212",
                color: "#fff",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#000",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": { backgroundColor: "#222" },
                scrollbarColor: "#000 #222",
                scrollbarWidth: "thin",
              },
            },
          }}
        >
          <MenuItem value="ALL">
            <Checkbox
              checked={
                projectOptions.length > 0 &&
                selectedProjects.length === projectOptions.length
              }
              indeterminate={
                selectedProjects.length > 0 &&
                selectedProjects.length < projectOptions.length
              }
              sx={{ color: "#ccc", "&.Mui-checked": { color: "#2196f3" } }}
            />
            <ListItemText primary="Select All" />
          </MenuItem>

          {projectOptions.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox
                checked={selectedProjects.includes(name)}
                sx={{ color: "#ccc", "&.Mui-checked": { color: "#2196f3" } }}
              />
              <ColorSwatch color={colorMap[name] || "#999"} />
              <ListItemText primary={name} />
              <input
                type="color"
                value={colorMap[name] || "#cccccc"}
                onChange={(e) => onColorChange(name, e.target.value)}
                style={{
                  marginLeft: 10,
                  marginRight: 4,
                  width: 26,
                  height: 26,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
                onClick={(e) => e.stopPropagation()}
                title="Change color"
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Layers Dropdown */}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel sx={{ color: "#ccc" }}>Layers</InputLabel>
        <Select
          label="Layers"
          defaultValue=""
          sx={{
            bgcolor: "#1a1a1a1d",
            color: "#ffffff",
            borderRadius: "8px",
            "& .MuiSvgIcon-root": { color: "#fff" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#555 !important",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#555 !important",
            },
          }}
        >
          <MenuItem value="charhar bhag">Charhar Bhag</MenuItem>
          <MenuItem value="CB Enclave">CB Enclave</MenuItem>
          <MenuItem value="Access Roads">Access Roads</MenuItem>
          <MenuItem value="M Toll Plaze">M Toll Plaze</MenuItem>
          <MenuItem value="Jhoke">Jhoke</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LayerFilterPanel;
