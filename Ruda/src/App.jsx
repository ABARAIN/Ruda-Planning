import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import LayerFilterPanel from './components/LayerFilterPanel';
import MapView from './components/MapView';

function randomPastel() {
  const h = Math.floor(Math.random() * 360);
  return `hsl(${h}, 70%, 75%)`;
}

const App = () => {
  const [features, setFeatures] = useState([]);
  const [selectedPhases, setSelectedPhases] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [colorMap, setColorMap] = useState({});

  // Fetch all features and assign a random color to each name
  useEffect(() => {
    axios.get('http://localhost:5000/api/all')
      .then(res => {
        const feats = res.data.features || [];
        setFeatures(feats);
        // Assign color to each unique name
        const names = [...new Set(feats.map(f => f.properties?.name).filter(Boolean))];
        setColorMap(prev => {
          const out = { ...prev };
          names.forEach(n => { if (!out[n]) out[n] = randomPastel(); });
          return out;
        });
      });
  }, []);

  // Select all phases by default
  useEffect(() => {
    if (features.length) {
      const phases = [...new Set(
        features
          .filter(f => f.properties?.name?.startsWith('Phase'))
          .map(f => f.properties.name)
      )];
      setSelectedPhases(phases);
    }
  }, [features]);

  useEffect(() => {
    const pkgs = [...new Set(
      features.filter(
        f =>
          f.properties?.name?.startsWith('RTW Package') &&
          f.properties?.ruda_phase &&
          selectedPhases.includes(f.properties.ruda_phase)
      ).map(f => f.properties.name)
    )];
    setSelectedPackages(pkgs);
  }, [features, selectedPhases]);

  useEffect(() => {
    const projs = [...new Set(
      features.filter(
        f =>
          (f.properties?.name?.startsWith('RTW P') || f.properties?.name === '11') &&
          f.properties?.rtw_pkg &&
          selectedPackages.includes(f.properties.rtw_pkg)
      ).map(f => f.properties.name)
    )];
    setSelectedProjects(projs);
  }, [features, selectedPackages]);

  const filteredFeatures = features.filter(f => {
    const n = f.properties.name;
    return (
      selectedPhases.includes(n) ||
      selectedPackages.includes(n) ||
      selectedProjects.includes(n)
    );
  });

  // Handle color change for a polygon
  const handleColorChange = (name, newColor) => {
    setColorMap(prev => ({ ...prev, [name]: newColor }));
  };

  return (
    <Box display="flex" height="100vh">
      <Box width="380px" bgcolor="#191c20" color="#fff" overflow="auto">
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
        <MapView features={filteredFeatures} colorMap={colorMap} />
      </Box>
    </Box>
  );
};

export default App;
