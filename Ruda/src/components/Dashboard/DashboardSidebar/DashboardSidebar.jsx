import React, { useMemo } from "react";
import {
  Home,
  Layers,
  Settings,
  ChevronDown,
  ChevronUp,
  Route,
  MapPin,
  Landmark,
  LayoutDashboard,
} from "lucide-react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";

const DashboardSidebar = ({
  features = [],
  colorMap = {},
  onColorChange,
  openLayers = true,
  setOpenLayers = () => {},
  selectedPhases = [],
  setSelectedPhases = () => {},
  selectedPackages = [],
  setSelectedPackages = () => {},
  selectedCategories = [],
  setSelectedCategories = () => {},
  selectedProjects = [],
  setSelectedProjects = () => {},
}) => {
  // openLayers is now controlled by parent if needed; keep default true

  // 🔹 Derived dropdown options
  const phaseOptions = useMemo(() => {
    const setValues = new Set();
    // collect from properties.name that start with 'phase'
    features.forEach((f) => {
      const name = f.properties?.name;
      if (
        name &&
        typeof name === "string" &&
        name.toLowerCase().startsWith("phase")
      ) {
        setValues.add(name);
      }
      const rudaPhase = f.properties?.ruda_phase;
      if (rudaPhase && typeof rudaPhase === "string") {
        setValues.add(rudaPhase);
      }
    });
    return Array.from(setValues);
  }, [features]);

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
                    f.properties.ruda_phase?.toLowerCase() ===
                    phase?.toLowerCase()
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
          f.properties?.rtw_pkg &&
          selectedPackages.includes(f.properties.rtw_pkg) &&
          selectedCategories.includes(f.properties?.category)
      )
      .map((f) => f.properties.name);
  }, [features, selectedPackages, selectedCategories]);

  const renderDropdown = (label, value, setValue, options) => {
    const isAllSelected = options.length > 0 && value.length === options.length;

    const handleChange = (event) => {
      const selected = event.target.value;
      if (selected.includes("ALL")) {
        setValue(isAllSelected ? [] : options);
        return;
      }
      setValue(selected);
    };

    return (
      <FormControl fullWidth sx={{ mt: 1 }}>
        <InputLabel sx={{ color: "#bbb", top: "-8px", fontSize: "0.9rem" }}>
          {label}
        </InputLabel>
        <Select
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(", ")}
          sx={{
            color: "#fff",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "6px",
            "& .MuiSvgIcon-root": { color: "#fff" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
            height: "38px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "10px", // make text more centered horizontally
            paddingRight: "30px", // keep icon space balanced
            ".MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              padding: "0 !important", // remove internal offset
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                backgroundColor: "#1e1e1e",
                color: "#fff",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#333",
                  borderRadius: "4px",
                },
              },
            },
          }}
        >
          <MenuItem value="ALL">
            <Checkbox
              checked={isAllSelected}
              indeterminate={value.length > 0 && value.length < options.length}
              sx={{ color: "#aaa", "&.Mui-checked": { color: "#2196f3" } }}
            />
            <ListItemText primary="Select All" />
          </MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              <Checkbox
                checked={value.includes(opt)}
                sx={{ color: "#ccc", "&.Mui-checked": { color: "#2196f3" } }}
              />
              <ListItemText primary={opt} />
              <input
                type="color"
                value={colorMap[opt] || "#cccccc"}
                onChange={(e) => onColorChange?.(opt, e.target.value)}
                style={{
                  marginLeft: 10,
                  width: 22,
                  height: 22,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <div
      style={{
        width: "17%",
        height: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px 15px",
        fontFamily: '"Open Sans", sans-serif',
        overflowY: "auto",
      }}
    >
      {/* 🔹 Header */}
      <div style={{ textAlign: "Right", marginBottom: "15px" }}>
        <h2
          style={{
            fontWeight: "Normal",
            fontSize: "1.2rem",
            color: "#fff",
            letterSpacing: "0.5px",
            lineHeight: "1.4",
          }}
        >
          Ravi Urban Development Authority
        </h2>
      </div>

      {/* 🔹 Navigation + Filters + New Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px", // uniform spacing between sections
          marginBottom: "25px",
        }}
      >
        {/* Dashboard Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            padding: "8px 10px",
            borderRadius: "6px",
            transition: "0.2s",
            color: "#C1C3CF",
          }}
          onClick={() => (window.location.href = "/")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Home size={18} /> Dashboard
        </div>

        {/* Layer Filters Section */}
        <div>
          <div
            onClick={() => setOpenLayers(!openLayers)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.2s",
              color: "#C1C3CF",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={18} /> Layer Filters
            </div>
            {openLayers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {/* Dropdowns appear only when open */}
          {openLayers && (
            <div
              style={{
                paddingLeft: "10px",
                marginTop: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                transition: "0.3s",
              }}
            >
              {renderDropdown(
                "Phases",
                selectedPhases,
                setSelectedPhases,
                phaseOptions
              )}
              {renderDropdown(
                "Packages",
                selectedPackages,
                setSelectedPackages,
                packageOptions
              )}
              {renderDropdown(
                "Categories",
                selectedCategories,
                setSelectedCategories,
                categoryOptions
              )}
              {renderDropdown(
                "Projects",
                selectedProjects,
                setSelectedProjects,
                projectOptions
              )}
            </div>
          )}
        </div>

        {/* New Buttons Section */}
        <div
          style={{
            color: "#C1C3CF",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {[
            {
              name: "Proposed Roads",
              icon: <Route size={18} />,
              path: "/proposed-roads",
            },
            {
              name: "Priority Projects",
              icon: <MapPin size={18} />,
              path: "/priority-projects",
            },
            {
              name: "Available Land",
              icon: <Landmark size={18} />,
              path: "/available-land",
            },
            {
              name: "RTW Dashboard",
              icon: <LayoutDashboard size={18} />,
              path: "/rtw-dashboard",
            },
          ].map((btn) => (
            <div
              key={btn.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: "6px",
                transition: "0.2s",
              }}
              onClick={() => (window.location.href = btn.path)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {btn.icon} {btn.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
