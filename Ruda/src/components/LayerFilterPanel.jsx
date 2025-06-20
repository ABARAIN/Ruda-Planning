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

  const renderDropdown = (label, value, setValue, options) => {
    const isAllSelected = options.length > 0 && value.length === options.length;

    const handleChange = (event) => {
      const selected = event.target.value;

      if (selected.includes('ALL')) {
        if (isAllSelected) {
          setValue([]); // Deselect all
        } else {
          setValue(options); // Select all
        }
        return;
      }

      setValue(selected);
    };

    return (
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel sx={{ color: '#ccc' }}>{label}</InputLabel>
        <Select
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
                backgroundColor: '#1f1f1f',
                color: '#fff',
                scrollbarWidth: 'thin',
              }
            },
            MenuListProps: {
              disablePadding: true,
              style: { paddingTop: 0 }
            }
          }}
          sx={{
            bgcolor: '#2a2a2a', color: '#fff',
            '& .MuiSvgIcon-root': { color: '#fff' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
          }}
        >
          <MenuItem value="ALL">
            <Checkbox
              checked={isAllSelected}
              indeterminate={value.length > 0 && value.length < options.length}
              sx={{
                color: '#ccc',
                '&.Mui-checked': { color: '#2196f3' }
              }}
            />
            <ListItemText primary="Select All" />
          </MenuItem>

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
  };

  return (
    <Box
      sx={{
        width: 320,
        height: '100%',
        bgcolor: '#2a2a2a',
        color: '#fff',
        px: 2,
        py: 3,
        overflowY: 'auto',

        // ✅ Fully black thin scrollbar
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#1a1a1a',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#000',
          borderRadius: '3px',
        },
        scrollbarWidth: 'thin',
        scrollbarColor: '#000 #1a1a1a',
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        <span style={{ color: '#2196f3' }}>Layer Filters</span>
      </Typography>

      {renderDropdown('Phases', selectedPhases, setSelectedPhases, phaseOptions)}
      {renderDropdown('Packages', selectedPackages, setSelectedPackages, packageOptions)}
      {renderDropdown('Projects', selectedProjects, setSelectedProjects, projectOptions)}
    </Box>
  );
};

export default LayerFilterPanel;
