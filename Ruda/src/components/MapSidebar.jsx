import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput
} from '@mui/material';
import axios from 'axios';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: { maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP, width: 250 }
  }
};

const MapSidebar = ({ onFilterChange }) => {
  const [allFeatures, setAllFeatures] = useState([]);
  const [phaseOptions, setPhaseOptions] = useState([]);
  const [pkgOptions, setPkgOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);

  const [selectedPhases, setSelectedPhases] = useState([]);
  const [selectedPkgs, setSelectedPkgs] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    axios.get('/api/all').then(res => {
      const features = res.data.features || [];
      setAllFeatures(features);

      const allPhases = [...new Set(features.map(f => f.properties.ruda_phases).filter(Boolean))];
      const allPkgs = [...new Set(features.map(f => f.properties.rtw_pkg).filter(Boolean))];
      const allProjects = [...new Set(features.map(f => f.properties.name).filter(Boolean))];

      setPhaseOptions(allPhases);
      setPkgOptions(allPkgs);
      setProjectOptions(allProjects);
      setSelectedPhases(allPhases); // initially select all
      setSelectedPkgs(allPkgs);
      setSelectedProjects(allProjects);
    });
  }, []);

  useEffect(() => {
    const filtered = allFeatures.filter(f =>
      (!f.properties.ruda_phases || selectedPhases.includes(f.properties.ruda_phases)) &&
      (!f.properties.rtw_pkg || selectedPkgs.includes(f.properties.rtw_pkg)) &&
      selectedProjects.includes(f.properties.name)
    );
    onFilterChange(filtered);
  }, [selectedPhases, selectedPkgs, selectedProjects]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Map Filters</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Phases</InputLabel>
        <Select
          multiple
          value={selectedPhases}
          onChange={(e) => setSelectedPhases(e.target.value)}
          input={<OutlinedInput label="Phases" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {phaseOptions.map((phase) => (
            <MenuItem key={phase} value={phase}>
              <Checkbox checked={selectedPhases.includes(phase)} />
              <ListItemText primary={phase} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Packages</InputLabel>
        <Select
          multiple
          value={selectedPkgs}
          onChange={(e) => setSelectedPkgs(e.target.value)}
          input={<OutlinedInput label="Packages" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {pkgOptions.map((pkg) => (
            <MenuItem key={pkg} value={pkg}>
              <Checkbox checked={selectedPkgs.includes(pkg)} />
              <ListItemText primary={pkg} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Projects</InputLabel>
        <Select
          multiple
          value={selectedProjects}
          onChange={(e) => setSelectedProjects(e.target.value)}
          input={<OutlinedInput label="Projects" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {projectOptions.map((proj) => (
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

export default MapSidebar;
