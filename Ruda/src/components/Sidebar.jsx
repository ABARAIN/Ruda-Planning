import React, { useEffect, useState } from 'react';
import {
  Drawer, Box, Typography, FormControl, InputLabel,
  Select, MenuItem, Checkbox, ListItemText, OutlinedInput
} from '@mui/material';

const Sidebar = ({ filters, setFilters, hierarchy }) => {
  const { phases, phaseToPackages, packageToProjects } = hierarchy;

  const [selectedPhases, setSelectedPhases] = useState(filters.phases);
  const [selectedPackages, setSelectedPackages] = useState(filters.packages);
  const [selectedProjects, setSelectedProjects] = useState(filters.projects);

  // When phases change → update packages and projects
  useEffect(() => {
    const visiblePackages = selectedPhases.flatMap(p => phaseToPackages[p] || []);
    setSelectedPackages(visiblePackages);

    const visibleProjects = visiblePackages.flatMap(pkg => packageToProjects[pkg] || []);
    setSelectedProjects(visibleProjects);

    setFilters({
      phases: selectedPhases,
      packages: visiblePackages,
      projects: visibleProjects
    });
  }, [selectedPhases]);

  // When packages change → update projects
  useEffect(() => {
    const visibleProjects = selectedPackages.flatMap(pkg => packageToProjects[pkg] || []);
    setSelectedProjects(visibleProjects);

    setFilters({
      phases: selectedPhases,
      packages: selectedPackages,
      projects: visibleProjects
    });
  }, [selectedPackages]);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 280,
        [`& .MuiDrawer-paper`]: {
          width: 280,
          boxSizing: 'border-box',
          mt: 8,
          padding: 2
        }
      }}
    >
      <Box>
        {/* Phase Filter */}
        <Typography variant="h6" gutterBottom>RUDA Phases</Typography>
        <FormControl fullWidth margin="dense">
          <InputLabel>Phases</InputLabel>
          <Select
            multiple
            value={selectedPhases}
            onChange={e => setSelectedPhases(e.target.value)}
            input={<OutlinedInput label="Phases" />}
            renderValue={selected => selected.join(', ')}
          >
            {phases.map(p => (
              <MenuItem key={p} value={p}>
                <Checkbox checked={selectedPhases.includes(p)} />
                <ListItemText primary={p} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Package Filter */}
        <Typography variant="h6" gutterBottom mt={2}>RTW Packages</Typography>
        <FormControl fullWidth margin="dense">
          <InputLabel>Packages</InputLabel>
          <Select
            multiple
            value={selectedPackages}
            onChange={e => setSelectedPackages(e.target.value)}
            input={<OutlinedInput label="Packages" />}
            renderValue={selected => selected.join(', ')}
          >
            {selectedPhases
              .flatMap(phase => phaseToPackages[phase] || [])
              .map(pkg => (
                <MenuItem key={pkg} value={pkg}>
                  <Checkbox checked={selectedPackages.includes(pkg)} />
                  <ListItemText primary={pkg} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Project Filter */}
        <Typography variant="h6" gutterBottom mt={2}>Projects</Typography>
        <FormControl fullWidth margin="dense">
          <InputLabel>Projects</InputLabel>
          <Select
            multiple
            value={selectedProjects}
            onChange={e => setSelectedProjects(e.target.value)}
            input={<OutlinedInput label="Projects" />}
            renderValue={selected => selected.join(', ')}
          >
            {selectedPackages
              .flatMap(pkg => packageToProjects[pkg] || [])
              .map(proj => (
                <MenuItem key={proj} value={proj}>
                  <Checkbox checked={selectedProjects.includes(proj)} />
                  <ListItemText primary={proj} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
