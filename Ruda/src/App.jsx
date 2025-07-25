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
import LayerFilterPanel from "./components/LayerFilterPanel";
import MapView from "./components/MapView";
import DashboardRTWExact from "./components/DashboardRTW";
import { Routes, Route } from "react-router-dom";
import bbox from "@turf/bbox";
import RTWMap from "./components/RTWMap/RTWMap";
import GeoDataManager from "./components/GeoDataManager";
import Portfolio from "./components/Portfolio/Portfolio";
import RUDADevelopmentPlan from "./components/Gantt/RUDADevelopmentPlan";

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

const App = () => {
  const [features, setFeatures] = useState([]);
  const [selectedPhases, setSelectedPhases] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
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
      setColorMap((prev) => {
        const newMap = { ...prev };
        names.forEach((name) => {
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
    <Routes>
      <Route
        path="/"
        element={
          <>
            {/* Header */}
            <AppBar position="static" color="primary">
              <Toolbar sx={{ display: "flex", alignItems: "center" }}>
                {isMobile && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => setDrawerOpen(true)}
                    sx={{ mr: isMobile ? 0 : 2 }}
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
                    height: isMobile ? 40 : 45,
                    transform: "scale(2.8)",
                    transformOrigin: "left center",
                    mr: isMobile ? 6 : 7,
                  }}
                />
                {!isMobile && (
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      fontWeight: "bold",
                      letterSpacing: 0.5,
                      fontSize: "1.2rem",
                      flexGrow: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Ravi Urban Development Authority
                  </Typography>
                )}

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => (window.location.href = "/gantt")}
                  sx={{
                    ml: 1,
                    color: "#fff",
                    borderColor: "#fff",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    "&:hover": { backgroundColor: "#fff", color: "#000" },
                  }}
                >
                  Timeline
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => (window.location.href = "/portfolio")}
                  sx={{
                    ml: 1,
                    color: "#fff",
                    borderColor: "#fff",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    "&:hover": { backgroundColor: "#fff", color: "#000" },
                  }}
                >
                  Portfolio
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("toggleProposedRoads"))
                  }
                  sx={{
                    ml: 2,
                    color: "#fff",
                    borderColor: "#fff",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    "&:hover": { backgroundColor: "#fff", color: "#000" },
                  }}
                >
                  Proposed Roads
                </Button>
              </Toolbar>
            </AppBar>

            {/* Layout */}
            {isMobile ? (
              <>
                <Drawer
                  anchor="left"
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
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
                    width: 335,
                    height: "100%",
                    bgcolor: "#2a2a2a",
                    color: "#fff",
                    px: 2,
                    py: 3,
                    overflow: "hidden",
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
                  />
                </Box>
              </Box>
            )}
          </>
        }
      />
      <Route path="/map" element={<RTWMap />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/crud" element={<GeoDataManager />} />
      <Route path="/details/:name" element={<DashboardRTWExact />} />
      <Route path="/gantt" element={<RUDADevelopmentPlan />} />
    </Routes>
  );
};

export default App;
