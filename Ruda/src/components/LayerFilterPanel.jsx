import React, { useMemo } from 'react';
import {
  Box, Typography, FormControl, InputLabel, Select,
  MenuItem, Checkbox, ListItemText, OutlinedInput
} from '@mui/material';

const normalize = str => (str || '').toLowerCase().replace(/ruda\s+/i, '').trim();

const ColorSwatch = ({ color }) => (
  <span style={{
    display: 'inline-block',
    width: 18, height: 18, borderRadius: 4,
    background: color, border: '1.5px solid #888',
    marginRight: 8, verticalAlign: 'middle'
  }} />
);

const LayerFilterPanel = ({
  features = [],
  selectedPhases = [], setSelectedPhases,
  selectedPackages = [], setSelectedPackages,
  selectedProjects = [], setSelectedProjects,
  colorMap = {},
  onColorChange
}) => {

  // 🔹 Extract all unique phases (by name)
  const phaseOptions = useMemo(() =>
    [...new Set(
      features
        .filter(f => f.properties?.name?.toLowerCase().startsWith('phase'))
        .map(f => f.properties.name)
    )], [features]);

  // 🔹 Extract all packages linked to selected phases via ruda_phase column
  const packageOptions = useMemo(() =>
    [...new Set(
      features
        .filter(f =>
          f.properties?.name?.startsWith('RTW Package') &&
          f.properties?.ruda_phase &&
          selectedPhases.some(phase =>
            normalize(f.properties.ruda_phase) === normalize(phase))
        )
        .map(f => f.properties.name)
    )], [features, selectedPhases]);

  // 🔹 Extract all projects linked to selected packages via rtw_pkg column
  const projectOptions = useMemo(() =>
    [...new Set(
      features
        .filter(f =>
          (f.properties?.name?.startsWith('RTW P') || f.properties?.name === '11') &&
          f.properties?.rtw_pkg &&
          selectedPackages.includes(f.properties.rtw_pkg)
        )
        .map(f => f.properties.name)
    )], [features, selectedPackages]);

  const renderDropdown = (label, value, setValue, options) => (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={e => setValue(e.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
      >
        {options.map(opt => (
          <MenuItem key={opt} value={opt}>
            <Checkbox checked={value.includes(opt)} />
            <ColorSwatch color={colorMap[opt] || '#999'} />
            <ListItemText primary={opt} />
            <input
              type="color"
              value={colorMap[opt] || '#cccccc'}
              onChange={e => onColorChange(opt, e.target.value)}
              style={{
                marginLeft: 10, marginRight: 4,
                width: 26, height: 26, border: 'none',
                background: 'none', cursor: 'pointer'
              }}
              onClick={e => e.stopPropagation()}
              title="Change color"
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box p={2} sx={{ width: 320 }}>
      <Typography variant="h6" gutterBottom>Map Filters</Typography>
      {renderDropdown('Phases', selectedPhases, setSelectedPhases, phaseOptions)}
      {renderDropdown('Packages', selectedPackages, setSelectedPackages, packageOptions)}
      {renderDropdown('Projects', selectedProjects, setSelectedProjects, projectOptions)}
    </Box>
  );
};

export default LayerFilterPanel;
