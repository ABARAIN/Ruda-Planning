import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Box, CircularProgress, Typography, Card, CardContent, Divider,
  IconButton, Button
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
        const projectFeature = res.data.features.find(f => f.properties.name === 'RTW P-02');

        if (projectFeature) {
          const projectGeo = {
            type: 'FeatureCollection',
            features: [projectFeature],
          };

          mapRef.current.addSource('rtw-p02', {
            type: 'geojson',
            data: projectGeo,
          });

          mapRef.current.addLayer({
            id: 'rtw-p02-fill',
            type: 'fill',
            source: 'rtw-p02',
            paint: {
              'fill-color': '#ff0000',
              'fill-opacity': 0.6,
            },
            layout: { visibility: 'visible' },
          });

          mapRef.current.addLayer({
            id: 'rtw-p02-line',
            type: 'line',
            source: 'rtw-p02',
            paint: {
              'line-color': '#ff0000',
              'line-width': 2,
            },
            layout: { visibility: 'visible' },
          });

          projectArea = turf.area(projectFeature) / 4046.8564224;

          const coords = projectFeature.geometry.coordinates.flat(2);
          const bounds = coords.reduce(
            (b, [lng, lat]) => b.extend([lng, lat]),
            new mapboxgl.LngLatBounds(coords[0], coords[0])
          );
          mapRef.current.fitBounds(bounds, { padding: 50 });

          mapRef.current.on('click', 'rtw-p02-fill', e => {
            const areaAcre = projectArea.toFixed(2);
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`<strong>RTW P-02 Area:</strong><br>${areaAcre} acres`)
              .addTo(mapRef.current);
          });
        }

        const response = await fetch('/rtw2.geojson');
        const publicGeo = await response.json();

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
          layout: { visibility: 'visible' },
        });

        mapRef.current.addLayer({
          id: 'rtw2-line',
          type: 'line',
          source: 'rtw2-public',
          paint: {
            'line-color': '#00cc00',
            'line-width': 2,
          },
          layout: { visibility: 'visible' },
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
          polygons: perPolygonAreas,
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
      // 🟢 everything remains same at top (imports, mapbox token, useEffect, etc.)

// Inside the `return` of the component — only the chart panel is updated:
{areaStats && (
  <Card
    elevation={6}
    sx={{
      display: { xs: showChart ? 'block' : 'none', md: 'block' },
      position: 'absolute',
      top: { xs: 50, md: 20 },
      left: { xs: 10, md: 20 },
      width: { xs: 270, sm: 300, md: 360 },
      maxHeight: '90vh',
      overflowY: 'auto',
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

    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
      <Typography variant="h6" gutterBottom>
        Land Area Distribution
      </Typography>
    </Box>

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
