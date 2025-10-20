import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const DashboardMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    // 🔹 Initialize map with an empty style (transparent background)
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        name: "Transparent",
        sources: {},
        layers: [],
      },
      center: [74.3587, 31.5204], // Lahore
      zoom: 11,
      attributionControl: false,
    });

    const map = mapRef.current;

    map.on("load", () => {
      // Example: add your shapefile/geojson layer here
      // (replace this sample with your actual data)
      map.addSource("example-geojson", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [74.34, 31.52],
                    [74.38, 31.52],
                    [74.38, 31.55],
                    [74.34, 31.55],
                    [74.34, 31.52],
                  ],
                ],
              },
            },
          ],
        },
      });

      // Add your polygon layer
      map.addLayer({
        id: "example-polygon",
        type: "fill",
        source: "example-geojson",
        paint: {
          "fill-color": "#00ff88",
          "fill-opacity": 0.5,
        },
      });

      // Add border line
      map.addLayer({
        id: "example-border",
        type: "line",
        source: "example-geojson",
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
        },
      });
    });

    return () => map.remove();
  }, []);

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

export default DashboardMap;
