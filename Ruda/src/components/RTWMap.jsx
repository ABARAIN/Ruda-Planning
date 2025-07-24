import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Box, CircularProgress, Typography, Card, IconButton, Button, Divider, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import axios from 'axios';
import * as turf from '@turf/turf';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import CancelIcon from '@mui/icons-material/Cancel';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const COLORS = ['#00cc00', '#ff3333'];

const RTWMap = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [areaStats, setAreaStats] = useState(null);
  const [layerVisibility, setLayerVisibility] = useState({ rtw: true, available: true });
  const [showChart, setShowChart] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [projectVisibility, setProjectVisibility] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('Phases');
  const [projectFeatures, setProjectFeatures] = useState([]);
  const allAvailableFeaturesRef = useRef([]);


  const nameToId = (name) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');


  const toggleLayer = (layerIdPrefix, visible) => {
    const visibility = visible ? 'visible' : 'none';
    const map = mapRef.current;
    ['fill', 'line'].forEach(type => {
      const layerId = `${layerIdPrefix}-${type}`;
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visibility);
      }
    });
  };




  const recalculateAreaStats = () => {
    const visibleRedFeatures = projectFeatures.filter(
      (f) => projectVisibility[f.properties.name]
    );
  
    const visibleRedNames = visibleRedFeatures.map((f) => f.properties.name.trim());
  
    const matchingGreenFeatures = allAvailableFeaturesRef.current.filter((f) => {

      const name = f.properties?.name?.trim();
      return visibleRedNames.includes(name);
    });
  
    const projectArea = visibleRedFeatures.reduce((sum, f) => sum + turf.area(f), 0) / 4046.8564224;
    const geojsonArea = matchingGreenFeatures.reduce((sum, f) => sum + turf.area(f), 0) / 4046.8564224;
  
    const polygons = [
      ...visibleRedFeatures.map((f, idx) => ({
        id: f.properties?.name || `Project ${idx + 1}`,
        area: turf.area(f) / 4046.8564224,
      })),
      ...matchingGreenFeatures.map((f, idx) => ({
        id: f.properties?.name || `Polygon ${idx + 1}`,
        area: turf.area(f) / 4046.8564224,
      })),
    ];
  
    setAreaStats({
      total: projectArea,
      available: geojsonArea,
      unavailable: projectArea - geojsonArea,
      polygons,
    });


    const greenLayerSource = mapRef.current.getSource('rtw2-public');
    if (greenLayerSource) {
      greenLayerSource.setData({
        type: 'FeatureCollection',
        features: matchingGreenFeatures,
      });
    
      // 🔁 Automatically show green layer only if data is not empty AND checkbox is ON
      const visibility = matchingGreenFeatures.length > 0 && layerVisibility.available ? 'visible' : 'none';
      ['fill', 'line'].forEach((type) => {
        const layerId = `rtw2-${type}`;
        if (mapRef.current.getLayer(layerId)) {
          mapRef.current.setLayoutProperty(layerId, 'visibility', visibility);
        }
      });
    }
    

  };
  










  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [74.3, 31.5],
      zoom: 11,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    mapRef.current.on('load', async () => {
      try {
        let projectArea = 0;
        let geojsonArea = 0;

        const res = await axios.get('https://ruda-backend-ny14.onrender.com/api/all');
        const projectFeatures = res.data.features;
        const features = res.data.features || [];

        // Sanitize and tag each feature with a clean unique ID
        const sanitizedFeatures = features.map((f, idx) => {
          const rawName = f.properties?.name?.trim();
          const fallbackName = `Project-${idx + 1}`;
          const name = rawName || fallbackName;
          const id = name.toLowerCase().replace(/[^a-z0-9-_]/gi, '-'); // Clean ID
          return { ...f, properties: { ...f.properties, name, _layerId: id } };
        });

        setProjectFeatures(sanitizedFeatures);

        // Create visibility map
        const visMap = {};


        sanitizedFeatures.forEach(f => { visMap[f.properties.name] = false; });

        setProjectVisibility(visMap);


        if (projectFeatures && projectFeatures.length > 0) {
          const projectGeo = {
            type: 'FeatureCollection',
            features: projectFeatures,
          };


          features.forEach((feature, idx) => {
            const name = feature.properties?.name || `Project-${idx}`;
            const id = name.replace(/\s+/g, '-').toLowerCase();

            mapRef.current.addSource(`project-${id}`, {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [feature],
              },
            });

            mapRef.current.addLayer({
              id: `project-${id}-fill`,
              type: 'fill',
              source: `project-${id}`,
              paint: {
                'fill-color': '#ff0000',
                'fill-opacity': 0.6,
              },
              layout: { visibility: 'none' },
            });

            mapRef.current.addLayer({
              id: `project-${id}-line`,
              type: 'line',
              source: `project-${id}`,
              paint: {
                'line-color': '#ff0000',
                'line-width': 2,
              },
              layout: { visibility: 'none' },
            });

            mapRef.current.on('click', `project-${id}-fill`, e => {
              const areaAcre = (turf.area(feature) / 4046.8564224).toFixed(2);
              new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<strong>${name}</strong><br>${areaAcre} acres`)
                .addTo(mapRef.current);
            });
          });


          projectArea = projectFeatures.reduce((sum, f) => sum + turf.area(f), 0) / 4046.8564224;

          const coords = projectFeatures
            .map(f => f.geometry.coordinates)
            .flat(3); // Flatten deeply in case of MultiPolygon

          const bounds = coords.reduce(
            (b, [lng, lat]) => b.extend([lng, lat]),
            new mapboxgl.LngLatBounds(coords[0], coords[0])
          );
          mapRef.current.fitBounds(bounds, { padding: 50 });

          mapRef.current.on('click', 'rtw-p02-fill', e => {
            const feature = e.features[0];
            const name = feature.properties?.name || 'Unnamed';
            const areaAcre = (turf.area(feature) / 4046.8564224).toFixed(2);
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`<strong>${name}:</strong><br>${areaAcre} acres`)
              .addTo(mapRef.current);
          });

        }

        const response = await fetch('/Final.geojson');
        const publicGeo = await response.json();
        allAvailableFeaturesRef.current = publicGeo.features;
 // ✅ Store green layer for filtering


        mapRef.current.addSource('rtw2-public', {
          type: 'geojson',
          data: publicGeo,
        });

        mapRef.current.addLayer({
          id: 'rtw2-fill',
          type: 'fill',
          source: 'rtw2-public',
          paint: {
            'fill-color': '#00cc00',
            'fill-opacity': 0.7,
          },
          layout: { visibility: 'none' },
        });

        mapRef.current.addLayer({
          id: 'rtw2-line',
          type: 'line',
          source: 'rtw2-public',
          paint: {
            'line-color': '#00cc00',
            'line-width': 2,
          },
          layout: { visibility: 'none' },
        });

        mapRef.current.on('click', 'rtw2-fill', e => {
          const feature = e.features[0];
          const area = turf.area(feature) / 4046.8564224;
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>Available Land:</strong><br>${area.toFixed(2)} acres`)
            .addTo(mapRef.current);
        });

        mapRef.current.on('mouseenter', 'rtw2-fill', () => {
          mapRef.current.getCanvas().style.cursor = 'pointer';
        });
        mapRef.current.on('mouseleave', 'rtw2-fill', () => {
          mapRef.current.getCanvas().style.cursor = '';
        });

        const perPolygonAreas = publicGeo.features.map((f, idx) => ({
          id: f.properties?.name || `Polygon ${idx + 1}`,
          area: turf.area(f) / 4046.8564224,
        }));

        geojsonArea = perPolygonAreas.reduce((sum, f) => sum + f.area, 0);

        setAreaStats({
          total: projectArea,
          available: geojsonArea,
          unavailable: projectArea - geojsonArea,
          polygons: [
            ...projectFeatures.map((f, idx) => ({
              id: f.properties?.name || `Project ${idx + 1}`,
              area: turf.area(f) / 4046.8564224,
            })),
            ...perPolygonAreas,
          ],
        });


        const styleTag = document.createElement('style');
        styleTag.innerHTML = '.mapboxgl-ctrl-attrib { display: none !important; }';
        document.head.appendChild(styleTag);

        setLoading(false);
      } catch (err) {
        console.error('Map load error:', err);
        setLoading(false);
      }
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  const chartData = areaStats
    ? [
      { name: 'Available', value: areaStats.available },
      { name: 'Unavailable', value: areaStats.unavailable },
    ]
    : [];

  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Box ref={mapContainer} sx={{ height: '100%', width: '100%' }} />

      {/* Toggle buttons for mobile */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1100,
          display: { xs: 'flex', md: 'none' },
          gap: 1,
        }}
      >


        <Button
          size="small"
          onClick={() => setShowChart(true)}
          sx={{
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid #fff',
            color: '#fff',
            textTransform: 'none',
            fontSize: '0.75rem',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
          }}
        >
          Show Chart
        </Button>
        <Button
          size="small"
          onClick={() => setShowToggle(true)}
          sx={{
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid #fff',
            color: '#fff',
            textTransform: 'none',
            fontSize: '0.75rem',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
          }}
        >
          Show Layers
        </Button>

      </Box>

      {/* Chart Panel */}
      {areaStats && (
        <Card
          elevation={6}
          sx={{
            display: { xs: showChart ? 'block' : 'none', md: 'block' },
            position: 'absolute',
            top: { xs: 50, md: 20 },
            left: { xs: 10, md: 20 },
            width: { xs: 270, sm: 300, md: 360 },
            maxHeight: { xs: '90vh', md: 'none' },
            overflowY: { xs: 'auto', md: 'visible' },
            zIndex: 1000,
            borderRadius: 2,
            bgcolor: 'rgba(20, 20, 20, 0.92)',
            color: 'white',
            p: 2,
          }}
        >
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="subtitle2">Land Distribution</Typography>
            <IconButton size="small" onClick={() => setShowChart(false)} sx={{ color: 'white' }}>
              <CancelIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ display: { xs: 'none', md: 'block' } }} gutterBottom>
            Land Area Distribution
          </Typography>

          <Box sx={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="60%"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v.toFixed(2)} acres`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Divider sx={{ my: 1, borderColor: '#555' }} />

          <Typography variant="body2">
            ⚪ <strong>Total RTW P-02 Area:</strong> {areaStats.total.toFixed(2)} acres
          </Typography>
          <Typography variant="body2">
            🟢 <strong>Available Area:</strong> {areaStats.available.toFixed(2)} acres
          </Typography>
          <Typography variant="body2">
            🔴 <strong>Unavailable Area:</strong> {areaStats.unavailable.toFixed(2)} acres
          </Typography>

          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
            ➤ Available Polygons:
          </Typography>
          {areaStats.polygons.map((p, idx) => (
            <Typography key={idx} variant="body2" sx={{ ml: 2, color: '#90ee90' }}>
              • {p.id}: {p.area.toFixed(2)} acres
            </Typography>
          ))}
        </Card>
      )}

      {/* Layer Toggle Panel */}
      <Card
        elevation={6}
        sx={{
          display: { xs: showToggle ? 'block' : 'none', md: 'block' },
          position: 'absolute',
          bottom: { xs: 30, md: 'auto' },
          top: { md: 20 },
          right: { md: 50 },
          left: { xs: 10, md: 'auto' },
          width: { xs: 260, md: 240 },
          zIndex: 1000,
          borderRadius: 3,
          bgcolor: 'rgba(25, 25, 25, 0.95)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.4)',
          color: 'white',
          p: 2,
        }}
      >
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="subtitle2">Layer Visibility</Typography>
          <IconButton size="small" onClick={() => setShowToggle(false)} sx={{ color: 'white' }}>
            <CancelIcon />
          </IconButton>
        </Box>

        <Typography variant="subtitle2" gutterBottom sx={{ display: { xs: 'none', md: 'block' } }}>
          Layer Visibility
        </Typography>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel sx={{ color: '#ccc' }}>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCategory(value);

              if (value === "Show All") {
                const allVisible = {};
                Object.keys(projectVisibility).forEach((name) => {
                  allVisible[name] = true;
                });
                setProjectVisibility(allVisible);

                // Also turn on all Map layers on the fly
                Object.entries(allVisible).forEach(([name, visible]) => {
                  ['fill', 'line'].forEach((type) => {
                    const id = nameToId(name);
                    const layerId = `project-${id}-${type}`;
                    if (mapRef.current.getLayer(layerId)) {
                      mapRef.current.setLayoutProperty(
                        layerId,
                        'visibility',
                        visible ? 'visible' : 'none'
                      );
                    }
                  });
                });
              }
            }}

            sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: '#777' } }}
          >

            <MenuItem value="Phases">Phases</MenuItem>
            <MenuItem value="Packages">Packages</MenuItem>
            <MenuItem value="Projects">Projects</MenuItem>
            <MenuItem value="Show All">Show All</MenuItem>
          </Select>

        </FormControl>


        <Button
          variant="outlined"
          size="small"
          fullWidth
          sx={{ color: 'white', borderColor: '#555', mb: 1 }}
          onClick={() => {
            // Filter names in current category
            const filteredNames = Object.keys(projectVisibility).filter(name => {
              if (selectedCategory === 'Projects' || selectedCategory === 'Show All') {
                return name.startsWith('RTW P-') || name === 'Rakh Jhoke Left-P' || name === 'Rakh Jhoke Right-P';
              }
              if (selectedCategory === 'Packages' || selectedCategory === 'Show All') {
                return name.includes('Package') || name === 'Rakh Jhoke Left' || name === 'Rakh Jhoke Right';
              }

              return !name.startsWith('RTW P-') && !name.includes('Package');
            });

            // Determine if we should show or hide based on any unchecked item
            const show = filteredNames.some(name => !projectVisibility[name]);

            // Build new visibility state for only filtered entries
            const updatedVisibility = { ...projectVisibility };
            filteredNames.forEach(name => {
              updatedVisibility[name] = show;

              const id = name.replace(/\s+/g, '-').toLowerCase();
              ['fill', 'line'].forEach(type => {
                const layerId = `project-${id}-${type}`;
                if (mapRef.current.getLayer(layerId)) {
                  mapRef.current.setLayoutProperty(layerId, 'visibility', show ? 'visible' : 'none');
                }
              });
            });

            setProjectVisibility(updatedVisibility);
            recalculateAreaStats();

          }}
        >
          Toggle All {selectedCategory}
        </Button>




        {(() => {
          const allNames = Object.keys(projectVisibility).filter(name => {
            if (selectedCategory === 'Projects') {
              return name.startsWith('RTW P-') || name === 'Rakh Jhoke Left-P' || name === 'Rakh Jhoke Right-P';
            }
            if (selectedCategory === 'Packages') {
              return name.includes('Package') || name === 'Rakh Jhoke Left' || name === 'Rakh Jhoke Right';
            }
            return (
              !name.startsWith('RTW P-') &&
              !name.includes('Package') &&
              name !== 'Rakh Jhoke Left-P' &&
              name !== 'Rakh Jhoke Right-P' &&
              name !== 'Rakh Jhoke Left' &&
              name !== 'Rakh Jhoke Right'
            );
          });

          const specialEndItems =
            selectedCategory === 'Projects'
              ? ['Rakh Jhoke Left-P', 'Rakh Jhoke Right-P']
              : selectedCategory === 'Packages'
                ? ['Rakh Jhoke Left', 'Rakh Jhoke Right']
                : [];

          const sorted = allNames
            .filter(name => !specialEndItems.includes(name))
            .sort((a, b) => {
              const aNum = parseInt(a.match(/\d+/)?.[0]);
              const bNum = parseInt(b.match(/\d+/)?.[0]);
              if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
              return a.localeCompare(b);
            })
            .concat(specialEndItems);

          return sorted.map((name, idx) => {
            const id = name.replace(/\s+/g, '-').toLowerCase();
            return (
              <Box key={idx} sx={{ mt: 1 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={projectVisibility[name]}
                    onChange={(e) => {
                      const visible = e.target.checked;
                      setProjectVisibility((prev) => ({ ...prev, [name]: visible }));
                      recalculateAreaStats();

                      ['fill', 'line'].forEach((type) => {
                        const layerId = `project-${id}-${type}`;
                        if (mapRef.current.getLayer(layerId)) {
                          mapRef.current.setLayoutProperty(
                            layerId,
                            'visibility',
                            visible ? 'visible' : 'none'
                          );
                        }
                      });

                      if (visible) {
                        const feature = projectFeatures.find(f => f.properties.name === name);
                        if (feature) {
                          const bounds = turf.bbox(feature);
                          mapRef.current.fitBounds(bounds, { padding: 40 });
                        }
                      }
                    }}
                  />
                  🔴 {name}
                </label>
              </Box>
            );
          });
        })()}

        <Box sx={{ mt: 2 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
  type="checkbox"
  checked={layerVisibility.available}
  onChange={(e) => {
    const val = e.target.checked;
    setLayerVisibility((prev) => ({ ...prev, available: val }));
    toggleLayer('rtw2', val);
    recalculateAreaStats(); // 🔁 Recalculate stats if visibility changes
  }}
/>

            🟢 Available Land
          </label>
        </Box>
      </Card>


      {/* Loading */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.6)',
            zIndex: 999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </Box>
  );
};

export default RTWMap;
