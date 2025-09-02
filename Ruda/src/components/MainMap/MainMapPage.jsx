import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import LayerFilterPanel from "./LayerFilterPanel";
import MapView from "./MapView";
import bbox from "@turf/bbox";

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

const MainMapPage = () => {
  const [features, setFeatures] = useState([]);
  const [selectedPhases, setSelectedPhases] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  // Remove selectedLayers, now layers are handled via selectedProjects
  const [colorMap, setColorMap] = useState({});
  const [districtBoundaries, setDistrictBoundaries] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const selectedNames = [
    ...selectedPhases,
    ...selectedPackages,
    ...selectedProjects,
  ];

  useEffect(() => {
    const fetchBoundaries = async () => {
      try {
        const [sheikhupura, lahore] = await Promise.all([
          axios.get("https://ruda-backend-ny14.onrender.com/api/sheikhpura"),
          axios.get("https://ruda-backend-ny14.onrender.com/api/lahore"),
        ]);
        setDistrictBoundaries([
          ...sheikhupura.data.features.map((f) => ({
            ...f,
            properties: { ...f.properties, district: "Sheikhupura" },
          })),
          ...lahore.data.features.map((f) => ({
            ...f,
            properties: { ...f.properties, district: "Lahore" },
          })),
        ]);
      } catch (err) {
        console.error("Error loading district boundaries:", err);
      }
    };

    fetchBoundaries();
  }, []);

  useEffect(() => {
    axios.get("https://ruda-backend-ny14.onrender.com/api/all").then((res) => {
      const feats = res.data.features || [];
      setFeatures(feats);

      const names = [
        ...new Set(feats.map((f) => f.properties?.name).filter(Boolean)),
      ];

      // Add layer names for color management
      const layerNames = [
        "Charhar Bhag",
        "CB Enclave",
        "Access Roads",
        "M Toll Plaze",
        "Jhoke",
      ];

      setColorMap((prev) => {
        const newMap = { ...prev };
        [...names, ...layerNames].forEach((name) => {
          if (!newMap[name]) newMap[name] = getRandomColor();
        });
        return newMap;
      });
    });
  }, []);

  useEffect(() => {
    const pkgs = [
      ...new Set(
        features
          .filter(
            (f) =>
              f.properties?.name?.startsWith("RTW Package") &&
              f.properties?.ruda_phase &&
              selectedPhases.includes(f.properties.ruda_phase)
          )
          .map((f) => f.properties.name)
      ),
    ];
    setSelectedPackages(pkgs);
  }, [features, selectedPhases]);

  const filteredFeatures = features.filter((f) =>
    selectedNames.includes(f.properties.name)
  );

  const handleColorChange = (name, newColor) => {
    setColorMap((prev) => ({
      ...prev,
      [name]: newColor,
    }));
  };

  // Map zoom logic for packages
  useEffect(() => {
    const map = window.__MAPBOX_INSTANCE__;
    if (!map || selectedPackages.length === 0) return;

    const pkgFeatures = features.filter((f) =>
      f.properties?.name?.startsWith("RTW Package")
    );
    const selection = {
      type: "FeatureCollection",
      features: pkgFeatures.filter((f) =>
        selectedPackages.includes(f.properties?.name)
      ),
    };

    if (!selection.features.length) return;

    const bounds = bbox(selection);
    map.fitBounds(bounds, { padding: 60, duration: 800 });
  }, [selectedPackages]);

  // Map zoom logic for projects
  useEffect(() => {
    const map = window.__MAPBOX_INSTANCE__;
    if (!map || selectedProjects.length === 0) return;

    const projFeatures = features.filter(
      (f) =>
        f.properties?.name?.startsWith("RTW P") || f.properties?.name === "11"
    );
    const selection = {
      type: "FeatureCollection",
      features: projFeatures.filter((f) =>
        selectedProjects.includes(f.properties?.name)
      ),
    };

    if (!selection.features.length) return;

    const bounds = bbox(selection);
    map.fitBounds(bounds, { padding: 60, duration: 800 });
  }, [selectedProjects]);

  return (
    <>
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#083373e1", // Darker blue color
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: "64px !important",
            paddingLeft: "0 !important", // Set left margin to 0
            paddingRight: "16px",
          }}
        >
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: isMobile ? 0 : 2, ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            component="img"
            src="/ruda.png"
            alt="RUDA Logo"
            sx={{
              width: isMobile ? 32 : 32,
              height: isMobile ? 40 : 49,
              transform: "scale(2.8)",
              transformOrigin: "left center",
              mr: isMobile ? 6 : 7,
              ml: isMobile ? 1 : 2, // Small left margin for logo
            }}
          />
          {!isMobile && (
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: "normal",
                letterSpacing: 0.5,
                fontSize: "1.5rem",
                flexGrow: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Ravi Urban Development Authority
            </Typography>
          )}

          {/* Button Container */}
          {/* Button Container */}
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => (window.location.href = "/upcoming-projects")}
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#fff",
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 300,
                borderRadius: "6px",
                padding: "5px 10px",
                minWidth: "auto",
                boxShadow: "none",
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Upcoming Projects
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() =>
                (window.location.href = "/hierarchical-gantt?filter=ongoing")
              }
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#fff",
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 300,
                borderRadius: "6px",
                padding: "5px 10px",
                minWidth: "auto",
                boxShadow: "none",
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Ongoing Projects
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => (window.location.href = "/hierarchical-gantt")}
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#fff",
                textTransform: "none",
                fontSize: "0.75rem", // Smaller font
                fontWeight: 300,
                borderRadius: "6px",
                padding: "5px 10px",
                minWidth: "auto",
                boxShadow: "none",
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Timeline
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => (window.location.href = "/portfolio")}
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#fff",
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 300,
                borderRadius: "6px",
                padding: "5px 10px",
                minWidth: "auto",
                boxShadow: "none",
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Portfolio
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("toggleProposedRoads"))
              }
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#fff",
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 300,
                borderRadius: "6px",
                padding: "5px 10px",
                minWidth: "auto",
                boxShadow: "none",
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Proposed Roads
            </Button>
            {/* 🔹 Logout Button Added */}
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                localStorage.clear(); // Remove token and user
                window.location.href = "/login"; // Redirect to login
              }}
              sx={{
                backgroundColor: "rgb(69 102 149)", // Red color for logout
                color: "#fff",
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 300,
                borderRadius: "6px",
                padding: "5px 12px",
                minWidth: "auto",
                boxShadow: "none",
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgb(69 102 149)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
                ml: 0, // Small margin-left from Proposed Roads
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Layout */}
      {isMobile ? (
        <>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                bgcolor: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.1)",
              },
            }}
          >
            <Box sx={{ width: 255 }}>
              <LayerFilterPanel
                features={features}
                selectedPhases={selectedPhases}
                setSelectedPhases={setSelectedPhases}
                selectedPackages={selectedPackages}
                setSelectedPackages={setSelectedPackages}
                selectedProjects={selectedProjects}
                setSelectedProjects={setSelectedProjects}
                colorMap={colorMap}
                onColorChange={handleColorChange}
                onClose={() => setDrawerOpen(false)}
              />
            </Box>
          </Drawer>
          <Box sx={{ height: "calc(100vh - 64px)" }}>
            <MapView
              features={filteredFeatures}
              colorMap={colorMap}
              selectedNames={selectedNames}
              districtBoundaries={districtBoundaries}
              selectedProjects={selectedProjects}
            />
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          height="calc(100vh - 64px)"
          sx={{ overflow: "hidden" }}
        >
          <Box
            sx={{
              width: 300,
              height: "100%",
              bgcolor: "#1a1a1a",
              color: "#fff",
              px: 0,
              py: 0,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              borderLeft: "none",
            }}
          >
            <LayerFilterPanel
              features={features}
              selectedPhases={selectedPhases}
              setSelectedPhases={setSelectedPhases}
              selectedPackages={selectedPackages}
              setSelectedPackages={setSelectedPackages}
              selectedProjects={selectedProjects}
              setSelectedProjects={setSelectedProjects}
              colorMap={colorMap}
              onColorChange={handleColorChange}
            />
          </Box>
          <Box flex={1} sx={{ overflow: "hidden" }}>
            <MapView
              features={filteredFeatures}
              colorMap={colorMap}
              selectedNames={selectedNames}
              districtBoundaries={districtBoundaries}
              selectedProjects={selectedProjects}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default MainMapPage;
