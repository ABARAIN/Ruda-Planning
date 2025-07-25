import React from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

const RTWRightSidebar = ({
  showToggle,
  setShowToggle,
  selectedCategory,
  setSelectedCategory,
  projectVisibility,
  setProjectVisibility,
  layerVisibility,
  setLayerVisibility,
  mapRef,
  toggleLayer,
  recalculateAreaStats,
  allAvailableFeaturesRef,
}) => {
  return (
    <>
      {/* Toggle button for mobile */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: 120,
          zIndex: 1100,
          display: { xs: "flex", md: "none" },
          gap: 1,
        }}
      >
        <Button
          size="small"
          onClick={() => setShowToggle(true)}
          sx={{
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "1px solid #fff",
            color: "#fff",
            textTransform: "none",
            fontSize: "0.75rem",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
          }}
        >
          Show Layers
        </Button>
      </Box>

      {/* Layer Toggle Panel */}
      <Card
        elevation={6}
        sx={{
          display: { xs: showToggle ? "block" : "none", md: "block" },
          position: "absolute",
          bottom: { xs: 30, md: "auto" },
          top: { md: 20 },
          right: { md: 50 },
          left: { xs: 10, md: "auto" },
          width: { xs: 260, md: 240 },
          zIndex: 1000,
          borderRadius: 3,
          bgcolor: "rgba(25, 25, 25, 0.95)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
          color: "white",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="subtitle2">Layer Visibility</Typography>
          <IconButton
            size="small"
            onClick={() => setShowToggle(false)}
            sx={{ color: "white" }}
          >
            <CancelIcon />
          </IconButton>
        </Box>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ display: { xs: "none", md: "block" } }}
        >
          Layer Visibility
        </Typography>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel sx={{ color: "#ccc" }}>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCategory(value);

              if (value === "Show All") {
                const allVisible = {};
                Object.keys(projectVisibility).forEach((name) => {
                  allVisible[name] = true;

                  const id = name.replace(/\s+/g, "-").toLowerCase();
                  ["fill", "line"].forEach((type) => {
                    const layerId = `project-${id}-${type}`;
                    if (mapRef.current.getLayer(layerId)) {
                      mapRef.current.setLayoutProperty(
                        layerId,
                        "visibility",
                        "visible"
                      );
                    }
                  });
                });

                setProjectVisibility(allVisible);
              }
            }}
            sx={{
              color: "white",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#777" },
            }}
          >
            <MenuItem value="Phases">Phases</MenuItem>
            <MenuItem value="Packages">Packages</MenuItem>
            <MenuItem value="Projects">Projects</MenuItem>
            <MenuItem value="Show All">Show All</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          fullWidth
          sx={{ color: "white", borderColor: "#555", mb: 1 }}
          onClick={() => {
            const filteredNames =
              selectedCategory === "Show All"
                ? Object.keys(projectVisibility)
                : Object.keys(projectVisibility).filter((name) => {
                    if (selectedCategory === "Projects") {
                      return (
                        name.startsWith("RTW P-") ||
                        name === "Rakh Jhoke Left-P" ||
                        name === "Rakh Jhoke Right-P"
                      );
                    }
                    if (selectedCategory === "Packages") {
                      return (
                        name.includes("Package") ||
                        name === "Rakh Jhoke Left" ||
                        name === "Rakh Jhoke Right"
                      );
                    }
                    return (
                      !name.startsWith("RTW P-") &&
                      !name.includes("Package") &&
                      name !== "Rakh Jhoke Left-P" &&
                      name !== "Rakh Jhoke Right-P" &&
                      name !== "Rakh Jhoke Left" &&
                      name !== "Rakh Jhoke Right"
                    );
                  });

            const show = filteredNames.some((name) => !projectVisibility[name]);

            const updatedVisibility = { ...projectVisibility };
            filteredNames.forEach((name) => {
              updatedVisibility[name] = show;

              const id = name.replace(/\s+/g, "-").toLowerCase();
              ["fill", "line"].forEach((type) => {
                const layerId = `project-${id}-${type}`;
                if (mapRef.current.getLayer(layerId)) {
                  mapRef.current.setLayoutProperty(
                    layerId,
                    "visibility",
                    show ? "visible" : "none"
                  );
                }
              });
            });

            setProjectVisibility(updatedVisibility);
            recalculateAreaStats();
          }}
        >
          Toggle All {selectedCategory}
        </Button>

        {(() => {
          const allNames = Object.keys(projectVisibility).filter((name) => {
            if (selectedCategory === "Projects") {
              return (
                name.startsWith("RTW P-") ||
                name === "Rakh Jhoke Left-P" ||
                name === "Rakh Jhoke Right-P"
              );
            }
            if (selectedCategory === "Packages") {
              return (
                name.includes("Package") ||
                name === "Rakh Jhoke Left" ||
                name === "Rakh Jhoke Right"
              );
            }
            return (
              !name.startsWith("RTW P-") &&
              !name.includes("Package") &&
              name !== "Rakh Jhoke Left-P" &&
              name !== "Rakh Jhoke Right-P" &&
              name !== "Rakh Jhoke Left" &&
              name !== "Rakh Jhoke Right"
            );
          });

          const specialEndItems =
            selectedCategory === "Projects"
              ? ["Rakh Jhoke Left-P", "Rakh Jhoke Right-P"]
              : selectedCategory === "Packages"
              ? ["Rakh Jhoke Left", "Rakh Jhoke Right"]
              : [];

          const regularItems = allNames.filter(
            (name) => !specialEndItems.includes(name)
          );
          const sorted = [...regularItems.sort(), ...specialEndItems];

          return sorted.map((name, idx) => {
            const id = name.replace(/\s+/g, "-").toLowerCase();
            return (
              <Box key={idx} sx={{ mt: 1 }}>
                <label
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <input
                    type="checkbox"
                    checked={projectVisibility[name]}
                    onChange={(e) => {
                      const visible = e.target.checked;
                      setProjectVisibility((prev) => ({
                        ...prev,
                        [name]: visible,
                      }));
                      recalculateAreaStats();

                      ["fill", "line"].forEach((type) => {
                        const layerId = `project-${id}-${type}`;
                        if (mapRef.current.getLayer(layerId)) {
                          mapRef.current.setLayoutProperty(
                            layerId,
                            "visibility",
                            visible ? "visible" : "none"
                          );
                        }
                      });

                      if (visible) {
                        const matchingGreen =
                          allAvailableFeaturesRef.current.filter(
                            (f) => f.properties?.name?.trim() === name.trim()
                          );

                        const greenLayerSource =
                          mapRef.current.getSource("rtw2-public");
                        if (greenLayerSource && matchingGreen.length > 0) {
                          greenLayerSource.setData({
                            type: "FeatureCollection",
                            features: matchingGreen,
                          });

                          ["fill", "line"].forEach((type) => {
                            const layerId = `rtw2-${type}`;
                            if (mapRef.current.getLayer(layerId)) {
                              mapRef.current.setLayoutProperty(
                                layerId,
                                "visibility",
                                "visible"
                              );
                            }
                          });
                        }
                      }
                    }}
                  />
                  🔴 {name}
                </label>
              </Box>
            );
          });
        })()}

        <FormControlLabel
          control={
            <Switch
              checked={layerVisibility.available}
              onChange={(e) => {
                const isChecked = e.target.checked;
                const newVisibility = {
                  ...layerVisibility,
                  available: isChecked,
                };
                setLayerVisibility(newVisibility);

                if (isChecked) {
                  // Show available land only for currently visible projects
                  recalculateAreaStats();
                } else {
                  // Hide available land completely
                  ["fill", "line"].forEach((type) => {
                    const layerId = `rtw2-${type}`;
                    if (mapRef.current.getLayer(layerId)) {
                      mapRef.current.setLayoutProperty(
                        layerId,
                        "visibility",
                        "none"
                      );
                    }
                  });
                }
              }}
            />
          }
          label="🟢 Available Land"
          sx={{ color: "white", mb: 2 }}
        />
      </Card>
    </>
  );
};

export default RTWRightSidebar;
