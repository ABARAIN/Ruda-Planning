
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const Project02Map = () => {
  const [projectGeoJson, setProjectGeoJson] = useState(null);

  useEffect(() => {
    axios.get('https://ruda-backend-ny14.onrender.com/api/all')
      .then(res => {
        const features = res.data.features;
        const projectFeature = features.find(f => f.properties.name === 'RTW Package-02');
        if (projectFeature) {
          setProjectGeoJson({
            type: 'FeatureCollection',
            features: [projectFeature]
          });
        }
      })
      .catch(err => console.error('Failed to fetch project data:', err));
  }, []);

  return (
    <Box sx={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[31.5204, 74.3587]} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {projectGeoJson && <GeoJSON data={projectGeoJson} />}
      </MapContainer>
    </Box>
  );
};

export default Project02Map;
