import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import bbox from "@turf/bbox";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ProposedRoadsLayer from "./ProposedRoadsLayer";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const baseStyles = {
  Light: "mapbox://styles/mapbox/light-v11",
  Dark: "mapbox://styles/mapbox/dark-v11",
  Satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  Streets: "mapbox://styles/mapbox/streets-v12",
  Outdoors: "mapbox://styles/mapbox/outdoors-v12",
};

const landmarks = [
  // { name: 'Badshahi Mosque', coords: [74.3083, 31.5889], icon: './badshahi-mosque.svg'  },
  {
    name: "Minar-e-Pakistan",
    coords: [74.3091, 31.5922],
    icon: "./Minar-e-Pakistan.svg",
  },
  { name: "Tomb of Jahangir", coords: [74.3003, 31.6242], icon: "./Tomb.svg" },
  {
    name: "Punjab University",
    coords: [74.2889, 31.5032],
    icon: "./University.svg",
  },
  {
    name: "Punjab University",
    coords: [74.2889, 31.5032],
    icon: "./University.svg",
  },
  {
    name: "Eiffel Tower Bahria Town",
    coords: [74.18424, 31.3559],
    icon: "./Eiffel-Tower.svg",
  },
  // { name: 'Shahdara Town', coords: [74.2870, 31.6234], icon: './badshahi-mosque.svg' },
  {
    name: "Lahore Railway Station",
    coords: [74.3579, 31.582],
    icon: "./train.svg",
  },
  {
    name: "Data Darbar",
    coords: [74.313, 31.5823],
    icon: "./badshahi-mosque.svg",
  },
  { name: "Jallo Park", coords: [74.4416, 31.5884], icon: "./Park.svg" },
];

const MapView = ({
  features,
  colorMap,
  selectedNames,
  districtBoundaries = [],
}) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [baseStyleKey, setBaseStyleKey] = useState("Streets");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const geojson = {
    type: "FeatureCollection",
    features: features || [],
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: baseStyles[baseStyleKey],
      center: [74.2, 31.6],
      zoom: 9,
      attributionControl: false,
    });

    mapRef.current = map;
    window.__MAPBOX_INSTANCE__ = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-left");
    const drawControl = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true,
      },
    });
    map.addControl(drawControl, "top-left");
    map.on("draw.create", updateDistancePopup);
    map.on("draw.update", updateDistancePopup);
    map.on("draw.delete", removeDistancePopup);

    map.addControl(
      new mapboxgl.ScaleControl({ unit: "metric" }),
      "bottom-left"
    );

    map.on("load", () => addLayers(map));

    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();

    map.once("style.load", () => {
      addLayers(map);
      map.setCenter(center);
      map.setZoom(zoom);
    });

    map.setStyle(baseStyles[baseStyleKey]);
  }, [baseStyleKey]);

  useEffect(() => {
    const map = mapRef.current;
    const source = map?.getSource("ruda");
    if (source) {
      source.setData(geojson);
    }
  }, [features]);

  useEffect(() => {
    const map = mapRef.current;
    if (map?.getLayer("ruda-fill")) {
      map.setPaintProperty(
        "ruda-fill",
        "fill-color",
        buildFillExpression(features, colorMap)
      );
    }
  }, [colorMap, features]);

  useEffect(() => {
    const map = mapRef.current;
    const source = map?.getSource("districts");
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: districtBoundaries,
      });
    }
  }, [districtBoundaries]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedNames?.length || !features?.length) return;

    const matchedFeatures = features.filter((f) =>
      selectedNames.includes(f.properties?.name)
    );
    if (matchedFeatures.length === 0) return;

    const selection = {
      type: "FeatureCollection",
      features: matchedFeatures,
    };

    const bounds = bbox(selection);
    map.fitBounds(bounds, {
      padding: 60,
      duration: 800,
    });
  }, [selectedNames]);

  const addLayers = (map) => {
    map.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14,
    });
    map.setTerrain({ source: "mapbox-dem", exaggeration: 1.4 });

    if (!map.getSource("composite")) return;
    map.addLayer({
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["get", "min_height"],
        "fill-extrusion-opacity": 0.5,
      },
    });

    map.addSource("ruda", { type: "geojson", data: geojson });

    map.addLayer({
      id: "ruda-fill",
      type: "fill",
      source: "ruda",
      paint: {
        "fill-color": buildFillExpression(features, colorMap),
        "fill-opacity": 0.6,
      },
    });

    map.on("mouseenter", "ruda-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "ruda-fill", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("click", "ruda-fill", (e) => {
      const feature = e.features[0];
      const { name, area_sqkm, land_available_pct, physical_actual_pct } =
        feature.properties;

      const popupHTML = `
        <div style="font-family: 'Segoe UI', sans-serif; min-width:220px; padding:8px;">
          <h3 style="margin:0 0 8px; font-size:16px; color:#1976d2;">${
            name || "Unnamed"
          }</h3>
          <div style="font-size:14px; margin-bottom:8px;">
            <strong>Area:</strong> ${parseFloat(area_sqkm || 0).toFixed(
              2
            )} sq.km
          </div>
          <div style="display:flex; gap:6px; font-size:13px; margin-bottom:10px;">
            <a href="/map?selected=${encodeURIComponent(
              name
            )}" target="_blank" rel="noopener noreferrer" style="flex:1;text-decoration:none;">
              <div style="background:#e3f2fd;border:1px solid #90caf9;border-radius:6px;padding:6px;text-align:center;color:#1565c0;">
                <div style="font-weight:500;">Land Available</div>
                <div>${land_available_pct || 0}%</div>
              </div>
            </a>
            <a href="/phase2-gantt" target="_blank" style="flex:1;background:#fff8e1;border:1px solid #ffe082;border-radius:6px;padding:6px;text-align:center;color:#f9a825;text-decoration:none;display:block;cursor:pointer;">
              <div style="font-weight:500;">Physical Progress</div>
              <div>${physical_actual_pct || 0}%</div>
            </a>
          </div>
          <a href="/details/${encodeURIComponent(
            name
          )}" target="_blank" style="font-size:13px;color:#388e3c;font-weight:500;text-decoration:none;display:block;text-align:center;margin-top:2px;">
            🔍 View Details
          </a>
        </div>
      `;

      new mapboxgl.Popup().setLngLat(e.lngLat).setHTML(popupHTML).addTo(map);
    });

    map.addLayer({
      id: "ruda-outline",
      type: "line",
      source: "ruda",
      paint: { "line-color": "#000", "line-width": 1 },
    });

    if (!map.getSource("districts")) {
      map.addSource("districts", {
        type: "geojson",
        data: { type: "FeatureCollection", features: districtBoundaries },
      });

      map.addLayer(
        {
          id: "district-fill",
          type: "fill",
          source: "districts",
          paint: {
            "fill-color": [
              "match",
              ["get", "district"],
              "Sheikhupura",
              "#FF0000",
              "Lahore",
              "#32CD32",
              "#ccc",
            ],
            "fill-opacity": 0.2,
          },
        },
        "ruda-fill"
      );

      map.addLayer(
        {
          id: "district-outline",
          type: "line",
          source: "districts",
          paint: {
            "line-color": "#444",
            "line-width": 2,
          },
        },
        "ruda-fill"
      );
    } // === Add Landmark Markers ===
    landmarks.forEach((landmark) => {
      const el = document.createElement("div");

      // Default size
      let width = 32;
      let height = 32;

      // Make Minar-e-Pakistan bigger
      if (landmark.name === "Minar-e-Pakistan") {
        width = 50; // bigger size
        height = 50;
      }

      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundImage = `url("${landmark.icon}")`;

      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";

      new mapboxgl.Marker(el)
        .setLngLat(landmark.coords)
        .setPopup(
          new mapboxgl.Popup({ offset: 12 }).setHTML(`
            <div style="font-family: 'Segoe UI'; font-size: 14px;">
              <strong>${landmark.name}</strong>
            </div>
          `)
        )
        .addTo(map);
    });
  };

  let distancePopup = null;

  function updateDistancePopup(e) {
    const map = mapRef.current;
    if (!map || !e.features?.length) return;

    const feature = e.features[0];
    const coords = feature.geometry.coordinates;

    if (feature.geometry.type !== "LineString" || coords.length < 2) return;

    const from = coords[0];
    const to = coords[coords.length - 1];

    const R = 6371000; // radius of Earth in meters
    const rad = (deg) => (deg * Math.PI) / 180;

    const dLat = rad(to[1] - from[1]);
    const dLon = rad(to[0] - from[0]);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(from[1])) * Math.cos(rad(to[1])) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;

    const midpoint = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];

    if (distancePopup) distancePopup.remove();

    distancePopup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(midpoint)
      .setHTML(`<strong>Distance:</strong> ${(dist / 1000).toFixed(2)} km`)
      .addTo(map);
  }

  function removeDistancePopup() {
    if (distancePopup) {
      distancePopup.remove();
      distancePopup = null;
    }
  }

  return (
<>

   <style>
      {`
        .mapboxgl-popup-close-button {
          font-size: 30px !important;
          width: 40px !important;
          height: 40px !important;
          color: #1976d2 !important;
        }
      `}
    </style>

<div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Basemap dropdown */}
      <Box
        sx={{
          position: "absolute",
          top: isMobile ? 8 : 12,
          right: isMobile ? 8 : 12,
          zIndex: 10,
          background: "#fff",
          p: 1,
          borderRadius: 1,
          boxShadow: 2,
          minWidth: 120,
        }}
      >
        <FormControl size="small" fullWidth>
          <InputLabel>Basemap</InputLabel>
          <Select
            label="Basemap"
            value={baseStyleKey}
            onChange={(e) => setBaseStyleKey(e.target.value)}
          >
            {Object.keys(baseStyles).map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <ProposedRoadsLayer />
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
    </>
  );
};

const buildFillExpression = (features, colorMap) => {
  const pairs = features
    .filter((f) => !!f.properties?.name)
    .map((f) => [f.properties.name, colorMap[f.properties.name] || "#cccccc"]);
  const uniquePairs = Array.from(new Map(pairs).entries()).flat();
  return uniquePairs.length >= 2
    ? ["match", ["get", "name"], ...uniquePairs, "#cccccc"]
    : "#cccccc";
};

export default MapView;
