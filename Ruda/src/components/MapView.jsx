import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapView = ({ features, colorMap }) => {
  const mapRef = useRef(null);
  const map = useRef(null);

  const geojson = {
    type: 'FeatureCollection',
    features: features || []
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [74.3, 31.5],
      zoom: 10
    });

    map.current.on('load', () => {
      map.current.addSource('ruda-boundaries', {
        type: 'geojson',
        data: geojson
      });

      map.current.addLayer({
        id: 'ruda-fill',
        type: 'fill',
        source: 'ruda-boundaries',
        paint: {
          'fill-color': [
            'case',
            ...[].concat(...(features || []).map(f => [
              ['==', ['get', 'name'], f.properties.name],
              colorMap?.[f.properties.name] || '#f2c300'
            ])),
            '#f2c300'
          ],
          'fill-opacity': 0.35
        }
      });

      map.current.addLayer({
        id: 'ruda-line',
        type: 'line',
        source: 'ruda-boundaries',
        paint: {
          'line-color': '#222',
          'line-width': 2
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;
    if (!map.current.isStyleLoaded()) return;
    const src = map.current.getSource('ruda-boundaries');
    if (src) src.setData(geojson);
  }, [features]);

  useEffect(() => {
    if (!map.current) return;
    if (!map.current.isStyleLoaded()) return;
    // update the fill-color paint property dynamically for colorMap
    try {
      map.current.setPaintProperty('ruda-fill', 'fill-color', [
        'case',
        ...[].concat(...(features || []).map(f => [
          ['==', ['get', 'name'], f.properties.name],
          colorMap?.[f.properties.name] || '#f2c300'
        ])),
        '#f2c300'
      ]);
    } catch (e) {}
  }, [colorMap, features]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default MapView;
