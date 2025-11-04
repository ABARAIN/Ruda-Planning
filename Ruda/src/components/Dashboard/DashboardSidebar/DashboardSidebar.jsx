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
  setOpenLayers = undefined,
  selectedPhases = [],
  setSelectedPhases = () => {},
  selectedPackages = [],
  setSelectedPackages = () => {},
  selectedCategories = [],
  setSelectedCategories = () => {},
  selectedProjects = [],
  setSelectedProjects = () => {},
  // popup toggles
  showPhasePopups = false,
  setShowPhasePopups = undefined,
  showPackagePopups = false,
  setShowPackagePopups = undefined,
  showProjectPopups = false,
  setShowProjectPopups = undefined,
  // optional style to override the root container (useful for overlaying on map)
  containerStyle = undefined,
}) => {
  // Manage open/closed state for Layer Filters; prefer parent-controlled if provided
  const [localOpen, setLocalOpen] = React.useState(true);
  const isOpen = typeof setOpenLayers === "function" ? openLayers : localOpen;
  const setOpen =
    typeof setOpenLayers === "function" ? setOpenLayers : setLocalOpen;

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
                fontSize: "0.5rem", // 👈 smaller font for all dropdown options
                "& .MuiMenuItem-root": {
                  fontSize: "0.5rem", // 👈 applies to each MenuItem
                },
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
                sx={{ color: "#fff", "&.Mui-checked": { color: "#2196f3" } }}
              />
              <ListItemText primary={opt} />
              <input
                type="color"
                value={colorMap[opt] || "#fff"}
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

  const rootStyle = {
    width: "17%",
    height: "100vh",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "20px 15px",
    fontFamily: '"Open Sans", sans-serif',
    overflowY: "auto",
  };

  return (
    <div style={{ ...rootStyle, ...(containerStyle || {}) }}>
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
            fontSize: "0.9rem",
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

        {/* 🔹 Separator line */}
        <div
          style={{
            height: "1px",
            background: "rgba(255, 255, 255, 0.144)",
            margin: "0px 0",
            borderRadius: "10px",
          }}
        />

        {/* Layer Filters Section */}
        <div>
          <div
            onClick={() => setOpen(!isOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.2s",
              color: "#C1C3CF",
              fontSize: "0.9rem",
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
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {/* Dropdowns appear only when open */}
          {isOpen && (
            <div
              style={{
                paddingLeft: "10px",
                marginTop: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                transition: "0.3s",
                fontSize: "0.9rem",
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
        {/* 🔹 New Buttons Section */}
        <div
          style={{
            color: "#C1C3CF",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "0.9rem",
          }}
        >
          {/* 🔹 Separator line */}
          <div
            style={{
              height: "0.5px",
              background: "rgba(255, 255, 255, 0.144)",
              margin: "0px 0",
              borderRadius: "1px",
              marginTop: "10px",
            }}
          />
          {/* 🔹 Project Filters dropdown (new collapsible section) */}
          {(() => {
            const [openFilters, setOpenFilters] = React.useState(true);
            return (
              <div style={{ marginTop: 5 }}>
                {/* Header with same style as Layer Filters */}
                <div
                  onClick={() => setOpenFilters(!openFilters)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "0.2s",
                    color: "#C1C3CF",
                    fontSize: "0.9rem",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <MapPin size={16} /> Project Filters
                  </div>
                  {openFilters ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>

                {/* Inner checkboxes appear when open */}
                {openFilters && (
                  <div
                    style={{
                      paddingLeft: "10px",
                      marginTop: "8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "11px",
                      transition: "0.3s",
                      fontSize: "0.9rem",
                    }}
                  >
                    {/* ✅ Phases */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        transition: "0.2s",
                        backgroundColor: "rgb(54 59 97)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgb(54 59 97)")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={!!showPhasePopups}
                        onChange={(e) => setShowPhasePopups?.(e.target.checked)}
                      />
                      Phases
                    </label>

                    {/* ✅ Packages */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        transition: "0.2s",
                        backgroundColor: "rgb(54 59 97)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgb(54 59 97)")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={!!showPackagePopups}
                        onChange={(e) =>
                          setShowPackagePopups?.(e.target.checked)
                        }
                      />
                      Packages
                    </label>

                    {/* ✅ Projects */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        transition: "0.2s",
                        backgroundColor: "rgb(54 59 97)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgb(54 59 97)")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={!!showProjectPopups}
                        onChange={(e) =>
                          setShowProjectPopups?.(e.target.checked)
                        }
                      />
                      Projects
                    </label>
                  </div>
                )}
              </div>
            );
          })()}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* 🔹 Proposed Roads (separate line now) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: "6px",
                transition: "0.2s",
              }}
              onClick={() =>
                window.dispatchEvent(new CustomEvent("toggleProposedRoads"))
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Route size={18} /> Proposed Roads
            </div>

            {/* 🔹 Available Land (below Proposed Roads) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: "6px",
                transition: "0.2s",
              }}
              onClick={() => (window.location.href = "/available-land")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Landmark size={18} /> Available Land
            </div>

            {/* RTW Dashboard Button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: "6px",
                transition: "0.2s",
              }}
              onClick={() => (window.location.href = "/rtw-dashboard")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <LayoutDashboard size={18} /> RTW Dashboard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
