import React, { useMemo } from 'react';
import {
  Box, Typography, FormControl, InputLabel, Select,
  MenuItem, Checkbox, ListItemText, OutlinedInput
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

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
  const phaseOptions = useMemo(() =>
    [...new Set(
      features
        .filter(f => f.properties?.name?.toLowerCase().startsWith('phase'))
        .map(f => f.properties.name)
    )], [features]);

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
    )].sort((a, b) => a.localeCompare(b)), [features, selectedPhases]);

  const projectOptions = useMemo(() =>
    [...new Set(
      features
        .filter(f =>
          (f.properties?.name?.startsWith('RTW P') || f.properties?.name === '11') &&
          f.properties?.rtw_pkg &&
          selectedPackages.includes(f.properties.rtw_pkg)
        )
        .map(f => f.properties.name)
    )].sort((a, b) => a.localeCompare(b)), [features, selectedPackages]);

  const renderDropdown = (label, value, setValue, options) => (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel sx={{ color: '#ccc' }}>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={e => setValue(e.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(', ')}
        sx={{
          bgcolor: '#2a2a2a', color: '#fff',
          '& .MuiSvgIcon-root': { color: '#fff' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
              backgroundColor: '#1f1f1f',
              color: '#fff'
            }
          }
        }}
      >
        {options.map(opt => (
          <MenuItem key={opt} value={opt}>
            <Checkbox
              checked={value.includes(opt)}
              sx={{
                color: '#ccc',
                '&.Mui-checked': { color: '#2196f3' }
              }}
            />
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
    <Box
      sx={{
        width: 320,
        height: '100vh',
        bgcolor: '#2a2a2a', // Lighter gray instead of black
        color: '#fff',
        px: 2,
        py: 3,
        overflow: 'hidden',         // Removes scrollbars
        scrollbarWidth: 'none',     // Firefox
        '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Edge
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
       
        <span style={{ color: '#2196f3' }}>Layer Filters</span>
      </Typography>

      {renderDropdown('Phases', selectedPhases, setSelectedPhases, phaseOptions)}
      {renderDropdown('Packages', selectedPackages, setSelectedPackages, packageOptions)}
      {renderDropdown('Projects', selectedProjects, setSelectedProjects, projectOptions)}
    </Box>
  );
};

export default LayerFilterPanel;
