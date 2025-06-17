import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, InputLabel,
  Select, MenuItem, Checkbox, ListItemText, OutlinedInput
} from '@mui/material';
import axios from 'axios';

const SidebarFilter = ({ geojsonData, setVisibleFeatures }) => {
  const [phases, setPhases] = useState([]);
  const [packages, setPackages] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedPhases, setSelectedPhases] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  // 📥 Fetch and preprocess data
  useEffect(() => {
    const uniquePhases = new Set();
    const uniquePackages = new Set();
    const uniqueProjects = new Set();

    geojsonData.features.forEach(feature => {
      const { name, ruda_phase, rtw_pkg } = feature.properties;

      if (ruda_phase && !ruda_phase.toLowerCase().includes('package'))
        uniquePhases.add(ruda_phase);

      if (ruda_phase && ruda_phase.toLowerCase().includes('package'))
        uniquePackages.add(name);

      if (rtw_pkg)
        uniqueProjects.add(name);
    });

    setPhases([...uniquePhases]);
    setPackages([...uniquePackages]);
    setProjects([...uniqueProjects]);
    setSelectedPhases([...uniquePhases]); // default selected all
    setSelectedPackages([...uniquePackages]);
    setSelectedProjects([...uniqueProjects]);
  }, [geojsonData]);

  // 🎯 Update filtered layers on map
  useEffect(() => {
    const visible = geojsonData.features.filter(feature => {
      const { name, ruda_phase, rtw_pkg } = feature.properties;
      const isPhase = ruda_phase && !ruda_phase.toLowerCase().includes('package');
      const isPackage = ruda_phase && ruda_phase.toLowerCase().includes('package');
      const isProject = !!rtw_pkg;

      if (isPhase) return selectedPhases.includes(ruda_phase);
      if (isPackage) return selectedPackages.includes(name);
      if (isProject) return selectedProjects.includes(name);
      return false;
    });

    setVisibleFeatures(visible);
  }, [selectedPhases, selectedPackages, selectedProjects, geojsonData]);

  return (
    <Box sx={{ width: 300, p: 2, bgcolor: '#f4f4f4', height: '100vh', overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom>📌 Map Layers</Typography>

      {/* Phases */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Phases</InputLabel>
        <Select
          multiple
          value={selectedPhases}
          onChange={e => setSelectedPhases(e.target.value)}
          input={<OutlinedInput label="Phases" />}
          renderValue={selected => selected.join(', ')}
        >
          {phases.map(phase => (
            <MenuItem key={phase} value={phase}>
              <Checkbox checked={selectedPhases.includes(phase)} />
              <ListItemText primary={phase} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Packages */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Packages</InputLabel>
        <Select
          multiple
          value={selectedPackages}
          onChange={e => setSelectedPackages(e.target.value)}
          input={<OutlinedInput label="Packages" />}
          renderValue={selected => selected.join(', ')}
        >
          {packages.map(pkg => (
            <MenuItem key={pkg} value={pkg}>
              <Checkbox checked={selectedPackages.includes(pkg)} />
              <ListItemText primary={pkg} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Projects */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Projects</InputLabel>
        <Select
          multiple
          value={selectedProjects}
          onChange={e => setSelectedProjects(e.target.value)}
          input={<OutlinedInput label="Projects" />}
          renderValue={selected => selected.join(', ')}
        >
          {projects.map(proj => (
            <MenuItem key={proj} value={proj}>
              <Checkbox checked={selectedProjects.includes(proj)} />
              <ListItemText primary={proj} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SidebarFilter;
