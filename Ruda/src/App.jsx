import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import LayerFilterPanel from './components/LayerFilterPanel';
import MapView from './components/MapView';
import bbox from '@turf/bbox';
import DashboardRTWExact from './components/DashboardRTW';
import { Routes, Route } from 'react-router-dom';
function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

const App = () => {
  const [features, setFeatures] = useState([]);
  const [selectedPhases, setSelectedPhases] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [districtBoundaries, setDistrictBoundaries] = useState([]);

  const selectedNames = [
    ...selectedPhases,
    ...selectedPackages,
    ...selectedProjects
  ];

  // 🚀 Load district boundaries
  useEffect(() => {
    const fetchBoundaries = async () => {
      try {
        const [sheikhupura, lahore] = await Promise.all([
          axios.get('http://localhost:5000/api/sheikhpura'),
          axios.get('http://localhost:5000/api/lahore')
        ]);
        setDistrictBoundaries([
          ...sheikhupura.data.features.map(f => ({ ...f, properties: { ...f.properties, district: 'Sheikhupura' } })),
          ...lahore.data.features.map(f => ({ ...f, properties: { ...f.properties, district: 'Lahore' } }))
        ]);
      } catch (err) {
        console.error('Error loading district boundaries:', err);
      }
    };

    fetchBoundaries();
  }, []);

  // 🚀 Load all spatial features
  useEffect(() => {
    axios.get('http://localhost:5000/api/all').then(res => {
      const feats = res.data.features || [];
      setFeatures(feats);

      const names = [...new Set(feats.map(f => f.properties?.name).filter(Boolean))];
      setColorMap(prev => {
        const newMap = { ...prev };
        names.forEach(name => {
          if (!newMap[name]) newMap[name] = getRandomColor();
        });
        return newMap;
      });
    });
  }, []);

  // 🧠 Extract phases
  useEffect(() => {
    const phases = [...new Set(
      features.filter(f => f.properties?.name?.startsWith('Phase')).map(f => f.properties.name)
    )];
    setSelectedPhases(phases);
  }, [features]);

  // 🧠 Extract packages from selected phases
  useEffect(() => {
    const pkgs = [...new Set(
      features.filter(f =>
        f.properties?.name?.startsWith('RTW Package') &&
        f.properties?.ruda_phase &&
        selectedPhases.includes(f.properties.ruda_phase)
      ).map(f => f.properties.name)
    )];
    setSelectedPackages(pkgs);
  }, [features, selectedPhases]);

  // 🧠 Extract projects from selected packages
  useEffect(() => {
    const projs = [...new Set(
      features.filter(f =>
        (f.properties?.name?.startsWith('RTW P') || f.properties?.name === '11') &&
        f.properties?.rtw_pkg &&
        selectedPackages.includes(f.properties.rtw_pkg)
      ).map(f => f.properties.name)
    )];
 
  }, [features, selectedPackages]);

  // 🎯 Filter visible features
  const filteredFeatures = features.filter(f =>
    selectedNames.includes(f.properties.name)
  );

  const handleColorChange = (name, newColor) => {
    setColorMap(prev => ({
      ...prev,
      [name]: newColor
    }));
  };

  // 📍 Zoom helper for exact match
  const zoomToExactFeatures = (featuresList, selectedList) => {
    return {
      type: 'FeatureCollection',
      features: featuresList.filter(f =>
        selectedList.includes(f.properties?.name)
      )
    };
  };

  // ✅ Zoom to selected Package only (not children)
  useEffect(() => {
    const map = window.__MAPBOX_INSTANCE__;
    if (!map || selectedPackages.length === 0) return;

    const pkgFeatures = features.filter(f =>
      f.properties?.name?.startsWith('RTW Package')
    );
    const selection = zoomToExactFeatures(pkgFeatures, selectedPackages);
    if (!selection.features.length) return;

    const bounds = bbox(selection);
    map.fitBounds(bounds, { padding: 60, duration: 800 });
  }, [selectedPackages]);

  // ✅ Zoom to selected Project only
  useEffect(() => {
    const map = window.__MAPBOX_INSTANCE__;
    if (!map || selectedProjects.length === 0) return;

    const projFeatures = features.filter(f =>
      f.properties?.name?.startsWith('RTW P') || f.properties?.name === '11'
    );
    const selection = zoomToExactFeatures(projFeatures, selectedProjects);
    if (!selection.features.length) return;

    const bounds = bbox(selection);
    map.fitBounds(bounds, { padding: 60, duration: 800 });
  }, [selectedProjects]);

  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            {/* ✅ Main RUDA Dashboard UI */}
            <AppBar position="static" color="primary">
              <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                  (RUDA) Ravi Urban Development Authority
                </Typography>
              </Toolbar>
            </AppBar>

            <Box display="flex" height="calc(100vh - 64px)">
              <Box width="335px" bgcolor="#191c20" color="#fff" overflow="auto">
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
              <Box flex={1}>
                <MapView
                  features={filteredFeatures}
                  colorMap={colorMap}
                  selectedNames={selectedNames}
                  districtBoundaries={districtBoundaries}
                />
              </Box>
            </Box>
          </>
        } />
        
        <Route path="/details/:name" element={<DashboardRTWExact />} />
      </Routes>
    </>
  );
};

export default App;