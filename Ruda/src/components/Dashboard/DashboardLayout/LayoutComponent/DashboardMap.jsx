import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const DashboardMap = ({
  features = [],
  colorMap = {},
  selectedNames = [],
  center = [74.3587, 31.5204],
  zoom = 11,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // initialize map once with transparent (empty) style
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        name: "Transparent",
        sources: {},
        layers: [],
      },
      center,
      zoom,
      attributionControl: false,
    });

    return () => mapRef.current && mapRef.current.remove();
  }, []);

  // update source & layers when features or colorMap change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const filtered = (features || []).filter((f) => {
      if (!selectedNames || selectedNames.length === 0) return true;
      return selectedNames.includes(f.properties?.name);
    });

    const geojson = {
      type: "FeatureCollection",
      features: filtered,
    };

    const upsert = () => {
      try {
        // add or update source
        if (map.getSource("ruda-dashboard")) {
          map.getSource("ruda-dashboard").setData(geojson);
        } else {
          map.addSource("ruda-dashboard", { type: "geojson", data: geojson });

          // fill
          if (!map.getLayer("ruda-dashboard-fill")) {
            map.addLayer({
              id: "ruda-dashboard-fill",
              type: "fill",
              source: "ruda-dashboard",
              paint: {
                "fill-color": buildFillExpression(filtered, colorMap),
                "fill-opacity": 0.6,
              },
            });
          }

          // outline
          if (!map.getLayer("ruda-dashboard-outline")) {
            map.addLayer({
              id: "ruda-dashboard-outline",
              type: "line",
              source: "ruda-dashboard",
              paint: { "line-color": "#000", "line-width": 1 },
            });
          }
        }

        // update paint expression when colors change
        if (map.getLayer("ruda-dashboard-fill")) {
          map.setPaintProperty(
            "ruda-dashboard-fill",
            "fill-color",
            buildFillExpression(filtered, colorMap)
          );
        }

        // fit to data if we have features
        if (filtered.length > 0) {
          const coords = filtered
            .flatMap((f) => getCoordinatesFlat(f.geometry))
            .filter(Boolean);
          if (coords.length > 0) {
            const lons = coords.map((c) => c[0]);
            const lats = coords.map((c) => c[1]);
            const minLon = Math.min(...lons);
            const maxLon = Math.max(...lons);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            map.fitBounds([minLon, minLat, maxLon, maxLat], {
              padding: 40,
              duration: 500,
            });
          }
        }
      } catch (err) {
        // ignore transient errors (e.g., style not ready)
        // but do not throw — we'll retry when style loads
        // console.debug('upsert error', err);
      }
    };

    // Ensure style is fully loaded before adding sources/layers
    // Prefer map.isStyleLoaded if available, otherwise fall back to waiting for 'load'
    try {
      const styleLoaded =
        typeof map.isStyleLoaded === "function" ? map.isStyleLoaded() : false;
      if (styleLoaded) {
        upsert();
      } else {
        map.once("load", upsert);
      }
    } catch (e) {
      // As a fallback
      map.once("load", upsert);
    }
  }, [features, colorMap, selectedNames]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        background: "transparent",
      }}
    />
  );
};

const buildFillExpression = (features, colorMap) => {
  const pairs = (features || [])
    .filter((f) => !!f.properties?.name)
    .map((f) => [f.properties.name, colorMap[f.properties.name] || "#cccccc"]);
  const unique = Array.from(new Map(pairs).entries()).flat();
  return unique.length >= 2
    ? ["match", ["get", "name"], ...unique, "#cccccc"]
    : "#cccccc";
};

const getCoordinatesFlat = (geometry) => {
  if (!geometry) return [];
  const { type, coordinates } = geometry;
  if (type === "Point") return [coordinates];
  if (type === "MultiPoint" || type === "LineString") return coordinates;
  if (type === "MultiLineString" || type === "Polygon")
    return coordinates.flat();
  if (type === "MultiPolygon") return coordinates.flat(2);
  return [];
};

export default DashboardMap;
