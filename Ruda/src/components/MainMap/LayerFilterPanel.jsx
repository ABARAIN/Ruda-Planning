import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const ColorSwatch = ({ color }) => (
  <Box
    sx={{
      width: 16,
      height: 16,
      borderRadius: "50%",
      backgroundColor: color,
      marginRight: 1,
      border: "1px solid rgba(255,255,255,0.3)",
    }}
  />
);

const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "");

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
        <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>{label}</InputLabel>
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
                backgroundColor: "#1a1a1a",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": { backgroundColor: "rgba(255,255,255,0.05)" },
                scrollbarColor: "rgba(255,255,255,0.2) rgba(255,255,255,0.05)",
                scrollbarWidth: "thin",
              },
            },
          }}
          sx={{
            bgcolor: "rgba(255,255,255,0.05)",
            color: "#fff",
            borderRadius: 2,
            "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.7)" },
            "& .MuiOutlinedInput-notchedOutline": { 
              borderColor: "rgba(255,255,255,0.3)" 
            },
            "&:hover .MuiOutlinedInput-notchedOutline": { 
              borderColor: "rgba(255,255,255,0.5)" 
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { 
              borderColor: "rgba(255,255,255,0.7)" 
            },
          }}
        >
          <MenuItem value="ALL" sx={{ 
            color: "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}>
            <Checkbox
              checked={isAllSelected}
              indeterminate={value.length > 0 && value.length < options.length}
              sx={{ color: "rgba(255,255,255,0.7)", "&.Mui-checked": { color: "#4fc3f7" } }}
            />
            <ListItemText primary="Select All" />
          </MenuItem>

          {options.map((opt) => (
            <MenuItem key={opt} value={opt} sx={{ 
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}>
              <Checkbox
                checked={value.includes(opt)}
                sx={{ color: "rgba(255,255,255,0.7)", "&.Mui-checked": { color: "#4fc3f7" } }}
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
                    borderRadius: "4px",
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
        width: isMobile ? 260 : 320,
        height: isMobile ? "400%" : "100%",
        maxHeight: isMobile ? "100vh" : "100%",
        bgcolor: "#1a1a1a",
        color: "#fff",
        px: 2,
        py: 3,
        overflowY: "auto",
        position: "relative",
        border: "1px solid rgba(255,255,255,0.1)",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-track": { backgroundColor: "rgba(255,255,255,0.05)" },
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
            backgroundColor: "rgba(255,255,255,0.1)",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      )}

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        <span style={{ color: "#4fc3f7" }}>Layer Filters</span>
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

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Projects</InputLabel>
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
            bgcolor: "rgba(255,255,255,0.05)",
            color: "#fff",
            borderRadius: 2,
            "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.7)" },
            "& .MuiOutlinedInput-notchedOutline": { 
              borderColor: "rgba(255,255,255,0.3)" 
            },
            "&:hover .MuiOutlinedInput-notchedOutline": { 
              borderColor: "rgba(255,255,255,0.5)" 
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { 
              borderColor: "rgba(255,255,255,0.7)" 
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                backgroundColor: "#1a1a1a",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": { backgroundColor: "rgba(255,255,255,0.05)" },
                scrollbarColor: "rgba(255,255,255,0.2) rgba(255,255,255,0.05)",
                scrollbarWidth: "thin",
              },
            },
          }}
        >
          <MenuItem value="ALL" sx={{ 
            color: "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}>
            <Checkbox
              checked={
                projectOptions.length > 0 &&
                selectedProjects.length === projectOptions.length
              }
              indeterminate={
                selectedProjects.length > 0 &&
                selectedProjects.length < projectOptions.length
              }
              sx={{ color: "rgba(255,255,255,0.7)", "&.Mui-checked": { color: "#4fc3f7" } }}
            />
            <ListItemText primary="Select All" />
          </MenuItem>

          {projectOptions.map((name) => (
            <MenuItem key={name} value={name} sx={{ 
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}>
              <Checkbox
                checked={selectedProjects.includes(name)}
                sx={{ color: "rgba(255,255,255,0.7)", "&.Mui-checked": { color: "#4fc3f7" } }}
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
                  borderRadius: "4px",
                }}
                onClick={(e) => e.stopPropagation()}
                title="Change color"
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LayerFilterPanel;