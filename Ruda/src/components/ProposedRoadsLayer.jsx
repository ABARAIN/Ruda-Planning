import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const ProposedRoadsLayer = () => {
  const [proposedRoads, setProposedRoads] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = async () => {
      const next = !visible;
      setVisible(next);

      if (next && !proposedRoads) {
        try {
          const res = await fetch('https://ruda-backend-ny14.onrender.com/api/purposed_ruda_road_network');
          const data = await res.json();
          setProposedRoads(data);
        } catch (err) {
          console.error('Failed to load proposed roads:', err);
        }
      }
    };

    window.addEventListener('toggleProposedRoads', toggle);
    return () => window.removeEventListener('toggleProposedRoads', toggle);
  }, [visible, proposedRoads]);

  useEffect(() => {
    const map = window.__MAPBOX_INSTANCE__;
    if (!map || !proposedRoads) return;

    if (!map.getSource('proposed-roads')) {
      map.addSource('proposed-roads', {
        type: 'geojson',
        data: proposedRoads
      });

      map.addLayer({
        id: 'proposed-roads-line',
        type: 'line',
        source: 'proposed-roads',
        layout: {
          visibility: visible ? 'visible' : 'none'
        },
        paint: {
          'line-color': [
            'match',
            ['get', 'layer'],
            "300' CL", '#ff0000',
            "300' ROW", '#00bcd4',
            "bridge", '#9c27b0',
            "Primary Roads (300'-Wide)", '#2196f3',
            "Secondary Road (200'-Wide)", '#4caf50',
            "Tertiary Roads", '#ff9800',
            "Tertiary Roads (80'-Wide)", '#ff5722',
            "Uti Walk Cycle", '#8bc34a',
            '#888888'
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 1,
            14, 3,
            16, 6
          ],
          'line-cap': 'round',
          'line-join': 'round'
        }
      });

      map.on('click', 'proposed-roads-line', (e) => {
        const feature = e.features[0];
        const layerName = feature.properties?.layer || 'Unknown Layer';

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<strong>Layer:</strong> ${layerName}`)
          .addTo(map);
      });

      map.on('mouseenter', 'proposed-roads-line', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'proposed-roads-line', () => {
        map.getCanvas().style.cursor = '';
      });

    } else {
      map.setLayoutProperty(
        'proposed-roads-line',
        'visibility',
        visible ? 'visible' : 'none'
      );
    }
  }, [proposedRoads, visible]);

  return null;
};

export default ProposedRoadsLayer;
