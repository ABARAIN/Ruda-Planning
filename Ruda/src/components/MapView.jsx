import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import bbox from '@turf/bbox';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const baseStyles = {
  Light: 'mapbox://styles/mapbox/light-v11',
  Dark: 'mapbox://styles/mapbox/dark-v11',
  Satellite: 'mapbox://styles/mapbox/satellite-v9',
  'Satellite Streets': 'mapbox://styles/mapbox/satellite-streets-v12',
  Streets: 'mapbox://styles/mapbox/streets-v12',
  Outdoors: 'mapbox://styles/mapbox/outdoors-v12'
};

const MapView = ({ features, colorMap, selectedNames, districtBoundaries = [] }) => {

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [baseStyleKey, setBaseStyleKey] = useState('Light');

  const geojson = {
    type: 'FeatureCollection',
    features: features || []
  };

  // Initialize map once
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: baseStyles[baseStyleKey],
      center: [74.3, 31.45],
      zoom: 10,
      attributionControl: false
    });

    mapRef.current = map;
    window.__MAPBOX_INSTANCE__ = map;
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', () => addLayers(map));

    return () => map.remove();
  }, []);

  // Change style without refreshing whole map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();

    map.once('style.load', () => {
      addLayers(map);
      map.setCenter(center);
      map.setZoom(zoom);
    });

    map.setStyle(baseStyles[baseStyleKey]);
  }, [baseStyleKey]);

  // Update GeoJSON data
  useEffect(() => {
    const map = mapRef.current;
    const source = map?.getSource('ruda');
    if (source) {
      source.setData(geojson);
    }
  }, [features]);

  // Update fill color on color change
  useEffect(() => {
    const map = mapRef.current;
    if (map?.getLayer('ruda-fill')) {
      map.setPaintProperty(
        'ruda-fill',
        'fill-color',
        buildFillExpression(features, colorMap)
      );
    }
  }, [colorMap, features]);


  useEffect(() => {
    const map = mapRef.current;
    const source = map?.getSource('districts');
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: districtBoundaries
      });
    }
  }, [districtBoundaries]);
  
  // Fly to selected features
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedNames?.length || !features?.length) return;

    const matchedFeatures = features.filter(f =>
      selectedNames.includes(f.properties?.name)
    );
    if (matchedFeatures.length === 0) return;

    const selection = {
      type: 'FeatureCollection',
      features: matchedFeatures
    };

    const bounds = bbox(selection);
    map.fitBounds(bounds, {
      padding: 60,
      duration: 800
    });
  }, [selectedNames]);

  const addLayers = (map) => {
    // 3D Terrain
    map.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      tileSize: 512,
      maxzoom: 14
    });
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.4 });

    // 3D Buildings
    if (!map.getSource('composite')) return;
    map.addLayer({
      id: '3d-buildings',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 15,
      paint: {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'min_height'],
        'fill-extrusion-opacity': 0.5
      }
    });

    // RUDA Polygon Layer
    map.addSource('ruda', {
      type: 'geojson',
      data: geojson
    });

    map.addLayer({
      id: 'ruda-fill',
      type: 'fill',
      source: 'ruda',
      paint: {
        'fill-color': buildFillExpression(features, colorMap),
        'fill-opacity': 0.6
      }
    });

    map.addLayer({
      id: 'ruda-outline',
      type: 'line',
      source: 'ruda',
      paint: {
        'line-color': '#000',
        'line-width': 1
      }
    });


// Sheikhupura & Lahore Boundaries
if (!map.getSource('districts')) {
  map.addSource('districts', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: districtBoundaries
    }
  });

  map.addLayer({
    id: 'district-fill',
    type: 'fill',
    source: 'districts',
    paint: {
      'fill-color': [
        'match',
        ['get', 'district'],
        'Sheikhupura', '#FF0000',
        'Lahore', '#32CD32',
        '#ccc'
      ],
      'fill-opacity': 0.2
    }
  },'ruda-fill'); 

  map.addLayer({
    id: 'district-outline',
    type: 'line',
    source: 'districts',
    paint: {
      'line-color': '#444',
      'line-width': 2
    }
  },'ruda-fill'); 
}



  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 🔽 Basemap Dropdown */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 2,
          background: '#fff',
          p: 1,
          borderRadius: 1,
          boxShadow: 2
        }}
      >
        <FormControl size="small" fullWidth>
          <InputLabel>Basemap</InputLabel>
          <Select
            label="Basemap"
            value={baseStyleKey}
            onChange={(e) => setBaseStyleKey(e.target.value)}
          >
            {Object.keys(baseStyles).map(label => (
              <MenuItem key={label} value={label}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

const buildFillExpression = (features, colorMap) => {
  const nameColorPairs = features
    .filter(f => !!f.properties?.name)
    .map(f => [f.properties.name, colorMap[f.properties.name] || '#cccccc']);
  const uniquePairs = Array.from(new Map(nameColorPairs).entries()).flat();

  return uniquePairs.length >= 2
    ? ['match', ['get', 'name'], ...uniquePairs, '#cccccc']
    : '#cccccc';
};

export default MapView;
