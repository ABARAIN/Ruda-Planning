import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";

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

    // expose for other components (Popups) to access the instance
    window.__DASHBOARD_MAP__ = mapRef.current;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        if (window.__DASHBOARD_MAP__ === mapRef.current)
          delete window.__DASHBOARD_MAP__;
      }
    };
  }, []);

  // Proposed roads state: listen for toggle event and fetch on first show
  const proposedRef = useRef({ data: null, visible: false });
  useEffect(() => {
    const onToggle = async () => {
      const map = mapRef.current;
      proposedRef.current.visible = !proposedRef.current.visible;

      if (!proposedRef.current.data) {
        try {
          const res = await fetch(
            "https://ruda-planning.onrender.com/api/purposed_ruda_road_network"
          );
          const data = await res.json();
          proposedRef.current.data = data;
        } catch (err) {
          console.error("Failed to load proposed roads:", err);
          return;
        }
      }

      if (!map) return;

      // ensure source exists
      if (!map.getSource("proposed-roads")) {
        map.addSource("proposed-roads", {
          type: "geojson",
          data: proposedRef.current.data,
        });

        map.addLayer({
          id: "proposed-roads-line",
          type: "line",
          source: "proposed-roads",
          layout: {
            visibility: proposedRef.current.visible ? "visible" : "none",
          },
          paint: {
            "line-color": [
              "match",
              ["get", "layer"],
              "300' CL",
              "#ff0000",
              "300' ROW",
              "#00bcd4",
              "bridge",
              "#9c27b0",
              "Primary Roads (300'-Wide)",
              "#2196f3",
              "Secondary Road (200'-Wide)",
              "#4caf50",
              "Tertiary Roads",
              "#ff9800",
              "Tertiary Roads (80'-Wide)",
              "#ff5722",
              "Uti Walk Cycle",
              "#8bc34a",
              "#888888",
            ],
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              1,
              14,
              3,
              16,
              6,
            ],
            "line-cap": "round",
            "line-join": "round",
          },
        });

        // click popup similar to ProposedRoadsLayer
        map.on("click", "proposed-roads-line", (e) => {
          const feature = e.features && e.features[0];
          const layerName = feature?.properties?.layer || "Proposed Road";
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>${layerName}</strong>`)
            .addTo(map);
        });

        map.on(
          "mouseenter",
          "proposed-roads-line",
          () => (map.getCanvas().style.cursor = "pointer")
        );
        map.on(
          "mouseleave",
          "proposed-roads-line",
          () => (map.getCanvas().style.cursor = "")
        );
      } else {
        map.setLayoutProperty(
          "proposed-roads-line",
          "visibility",
          proposedRef.current.visible ? "visible" : "none"
        );
      }
    };

    window.addEventListener("toggleProposedRoads", onToggle);
    return () => window.removeEventListener("toggleProposedRoads", onToggle);
  }, []);

  // update source & layers when features or colorMap change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const filtered = (features || []).filter((f) => {
      if (!selectedNames || selectedNames.length === 0) return true;
      return selectedNames.includes(f.properties?.name);
    });

    // Enrich features with normalized popup title and precomputed area (sq.km)
    const enriched = (filtered || []).map((feat) => {
      const title = feat.properties?.ruda_phase || feat.properties?.name || "";
      let areaSqKm = null;
      try {
        if (feat && feat.geometry) {
          areaSqKm = turf.area(feat) / 1000000; // convert m^2 to km^2
        }
      } catch (err) {
        areaSqKm = null;
      }
      return {
        ...feat,
        properties: {
          ...feat.properties,
          __popupTitle: title,
          __areaSqKm: areaSqKm,
        },
      };
    });

    const geojson = {
      type: "FeatureCollection",
      features: enriched,
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

  // Hover popup for ruda-dashboard-fill — single reusable popup
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const popupRef = { current: null };
    const hoveredIdRef = { current: null };

    const onMove = (e) => {
      // only proceed if layer + source exist
      if (
        !map.getSource("ruda-dashboard") ||
        !map.getLayer("ruda-dashboard-fill")
      )
        return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: ["ruda-dashboard-fill"],
      });

      if (!features || features.length === 0) {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
        hoveredIdRef.current = null;
        map.getCanvas().style.cursor = "";
        return;
      }

      const f = features[0];
      // Identify layer type (Project / Package / Phase)
      const layerId = f.layer?.id?.toLowerCase() || "";
      let typeLabel = "Feature";
      if (layerId.includes("project")) typeLabel = "Project";
      else if (layerId.includes("package")) typeLabel = "Package";
      else if (layerId.includes("phase")) typeLabel = "Phase";

      // Get title and area
      const title =
        f.properties?.__popupTitle ||
        f.properties?.ruda_phase ||
        f.properties?.name ||
        "Unnamed Feature";

      const areaVal = f.properties?.__areaSqKm;
      const areaText =
        typeof areaVal === "number"
          ? `Area: ${areaVal.toFixed(2)} sq.km`
          : "Area: N/A";

      const id = title;
      if (hoveredIdRef.current === id && popupRef.current) {
        popupRef.current.setLngLat(e.lngLat);
        return;
      }

      hoveredIdRef.current = id;
      const html = `
        <div style="font-size: 11px; color: #242121; padding: 2px 2px; border-radius: 4px;">
            <div style="opacity:0.5;">${typeLabel}</div>
            <div>${title}</div>
            <div style="margin-top:2px;">${areaText}</div>
        </div>`;

      if (!popupRef.current)
        popupRef.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

      popupRef.current.setLngLat(e.lngLat).setHTML(html).addTo(map);
      map.getCanvas().style.cursor = "pointer";
    };

    const onLeave = () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      hoveredIdRef.current = null;
      map.getCanvas().style.cursor = "";
    };

    map.on("mousemove", onMove);
    map.on("mouseleave", "ruda-dashboard-fill", onLeave);

    return () => {
      map.off("mousemove", onMove);
      map.off("mouseleave", "ruda-dashboard-fill", onLeave);
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
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
