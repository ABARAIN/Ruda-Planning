import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import * as turf from "@turf/turf";
import RTWLeftSidebar from "./RTWLeftSidebar";
import RTWRightSidebar from "./RTWRightSidebar";
import RTWProjectList from "./RTWProjectList";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const RTWMap = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [areaStats, setAreaStats] = useState(null);
  const [layerVisibility, setLayerVisibility] = useState({
    rtw: true,
    available: true,
  });
  const [showChart, setShowChart] = useState(false); // Left sidebar closed initially
  const [showToggle, setShowToggle] = useState(true); // Right sidebar open initially
  const [projectVisibility, setProjectVisibility] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Phases");
  const [projectFeatures, setProjectFeatures] = useState([]);
  const allAvailableFeaturesRef = useRef([]);

  // REMOVE this useEffect completely - no auto-opening of left sidebar
  // useEffect(() => {
  //   if (areaStats) {
  //     setShowChart(true);
  //   }
  // }, [areaStats]);

  const toggleLayer = (layerIdPrefix, visible) => {
    const visibility = visible ? "visible" : "none";
    const map = mapRef.current;
    ["fill", "line"].forEach((type) => {
      const layerId = `${layerIdPrefix}-${type}`;
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, "visibility", visibility);
      }
    });
  };

  const recalculateAreaStats = () => {
    const visibleRedFeatures = projectFeatures.filter(
      (f) => projectVisibility[f.properties.name]
    );

    // Only calculate and set stats if there are actually visible features
    // This prevents auto-calculation on initial load
    if (visibleRedFeatures.length === 0) {
      setAreaStats(null);

      const greenLayerSource = mapRef.current?.getSource("rtw2-public");
      if (greenLayerSource) {
        greenLayerSource.setData({
          type: "FeatureCollection",
          features: [],
        });

        ["fill", "line"].forEach((type) => {
          const layerId = `rtw2-${type}`;
          if (mapRef.current?.getLayer(layerId)) {
            mapRef.current.setLayoutProperty(layerId, "visibility", "none");
          }
        });
      }
      return;
    }

    const visibleRedNames = visibleRedFeatures.map((f) =>
      f.properties.name.trim()
    );

    const matchingGreenFeatures = allAvailableFeaturesRef.current.filter(
      (f) => {
        const name = f.properties?.name?.trim();
        return visibleRedNames.includes(name);
      }
    );

    const projectArea =
      visibleRedFeatures.reduce((sum, f) => sum + turf.area(f), 0) /
      4046.8564224;
    const availableArea =
      matchingGreenFeatures.reduce((sum, f) => sum + turf.area(f), 0) /
      4046.8564224;
    const unavailableArea = projectArea - availableArea;

    setAreaStats({
      total: projectArea,
      available: availableArea,
      unavailable: unavailableArea,
      projectArea,
      availableArea,
    });

    const greenLayerSource = mapRef.current?.getSource("rtw2-public");
    if (greenLayerSource) {
      greenLayerSource.setData({
        type: "FeatureCollection",
        features: matchingGreenFeatures,
      });

      const shouldShowGreen =
        layerVisibility.available && matchingGreenFeatures.length > 0;
      const visibility = shouldShowGreen ? "visible" : "none";

      ["fill", "line"].forEach((type) => {
        const layerId = `rtw2-${type}`;
        if (mapRef.current?.getLayer(layerId)) {
          mapRef.current.setLayoutProperty(layerId, "visibility", visibility);
        }
      });
    }
  };

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [74.3, 31.5],
      zoom: 11,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    mapRef.current.on("load", async () => {
      try {
        let projectArea = 0;
        let geojsonArea = 0;

        const res = await axios.get(
          "https://ruda-backend-ny14.onrender.com/api/all"
        );
        const projectFeatures = res.data.features;
        const features = res.data.features || [];

        const sanitizedFeatures = features.map((f, idx) => {
          const rawName = f.properties?.name?.trim();
          const fallbackName = `Project-${idx + 1}`;
          const name = rawName || fallbackName;
          const id = name.toLowerCase().replace(/[^a-z0-9-_]/gi, "-");
          return { ...f, properties: { ...f.properties, name, _layerId: id } };
        });

        setProjectFeatures(sanitizedFeatures);

        const visMap = {};
        sanitizedFeatures.forEach((f) => {
          visMap[f.properties.name] = false;
        });
        setProjectVisibility(visMap);

        if (projectFeatures && projectFeatures.length > 0) {
          features.forEach((feature, idx) => {
            const name = feature.properties?.name || `Project-${idx}`;
            const id = name.replace(/\s+/g, "-").toLowerCase();

            mapRef.current.addSource(`project-${id}`, {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [feature],
              },
            });

            mapRef.current.addLayer({
              id: `project-${id}-fill`,
              type: "fill",
              source: `project-${id}`,
              paint: {
                "fill-color": "#ff0000",
                "fill-opacity": 0.6,
              },
              layout: { visibility: "none" },
            });

            mapRef.current.addLayer({
              id: `project-${id}-line`,
              type: "line",
              source: `project-${id}`,
              paint: {
                "line-color": "#ff0000",
                "line-width": 2,
              },
              layout: { visibility: "none" },
            });

            mapRef.current.on("click", `project-${id}-fill`, (e) => {
              const areaAcre = (turf.area(feature) / 4046.8564224).toFixed(2);
              new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<strong>${name}</strong><br>${areaAcre} acres`)
                .addTo(mapRef.current);
            });
          });

          projectArea =
            projectFeatures.reduce((sum, f) => sum + turf.area(f), 0) /
            4046.8564224;

          const coords = projectFeatures
            .map((f) => f.geometry.coordinates)
            .flat(3);

          const bounds = coords.reduce(
            (b, [lng, lat]) => b.extend([lng, lat]),
            new mapboxgl.LngLatBounds(coords[0], coords[0])
          );
          mapRef.current.fitBounds(bounds, { padding: 50 });
        }

        const response = await fetch("/Final.geojson");
        const publicGeo = await response.json();
        allAvailableFeaturesRef.current = publicGeo.features;

        mapRef.current.addSource("rtw2-public", {
          type: "geojson",
          data: publicGeo,
        });

        mapRef.current.addLayer({
          id: "rtw2-fill",
          type: "fill",
          source: "rtw2-public",
          paint: {
            "fill-color": "#00cc00",
            "fill-opacity": 0.7,
          },
          layout: { visibility: "none" },
        });

        mapRef.current.addLayer({
          id: "rtw2-line",
          type: "line",
          source: "rtw2-public",
          paint: {
            "line-color": "#00cc00",
            "line-width": 2,
          },
          layout: { visibility: "none" },
        });

        mapRef.current.on("click", "rtw2-fill", (e) => {
          const feature = e.features[0];
          const area = turf.area(feature) / 4046.8564224;
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
              `<strong>Available Land:</strong><br>${area.toFixed(2)} acres`
            )
            .addTo(mapRef.current);
        });

        mapRef.current.on("mouseenter", "rtw2-fill", () => {
          mapRef.current.getCanvas().style.cursor = "pointer";
        });
        mapRef.current.on("mouseleave", "rtw2-fill", () => {
          mapRef.current.getCanvas().style.cursor = "";
        });

        setLoading(false);
      } catch (err) {
        console.error("Map load error:", err);
        setLoading(false);
      }
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    recalculateAreaStats();
  }, [projectVisibility, layerVisibility]);

  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100vw" }}>
      <Box ref={mapContainer} sx={{ height: "100%", width: "100%" }} />

      <RTWLeftSidebar
        areaStats={areaStats}
        showChart={showChart}
        setShowChart={setShowChart}
        projectFeatures={projectFeatures}
        projectVisibility={projectVisibility}
        allAvailableFeaturesRef={allAvailableFeaturesRef}
      />

      <RTWRightSidebar
        showToggle={showToggle}
        setShowToggle={setShowToggle}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        projectVisibility={projectVisibility}
        setProjectVisibility={setProjectVisibility}
        layerVisibility={layerVisibility}
        setLayerVisibility={setLayerVisibility}
        mapRef={mapRef}
        toggleLayer={toggleLayer}
        recalculateAreaStats={recalculateAreaStats}
        allAvailableFeaturesRef={allAvailableFeaturesRef}
        projectFeatures={projectFeatures}
        setShowChart={setShowChart}
      />

      {/* <RTWProjectList
        showToggle={showToggle}
        selectedCategory={selectedCategory}
        projectVisibility={projectVisibility}
        setProjectVisibility={setProjectVisibility}
        mapRef={mapRef}
        recalculateAreaStats={recalculateAreaStats}
        allAvailableFeaturesRef={allAvailableFeaturesRef}
      /> */}

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.6)",
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </Box>
  );
};

export default RTWMap;
