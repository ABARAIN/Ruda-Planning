import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

const legendItems = [
  { label: "Primary Roads (300'-Wide)", color: "#2196f3" },
  { label: "Secondary Road (200'-Wide)", color: "#4caf50" },
  { label: "Tertiary Roads", color: "#ff9800" },
  { label: "Tertiary Roads (80'-Wide)", color: "#ff5722" },
  { label: "Uti Walk Cycle", color: "#8bc34a" },
  { label: "Bridge", color: "#9c27b0" },
  { label: "300' CL", color: "#ff0000" },
  { label: "300' ROW", color: "#00bcd4" },
];

const ProposedRoadsLayer = () => {
  const [proposedRoads, setProposedRoads] = useState(null);
  const [visible, setVisible] = useState(false);

  // 🔁 Preload GeoJSON and listen for toggle
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://ruda-planning.onrender.com/api/purposed_ruda_road_network"
        );
        const data = await res.json();
        setProposedRoads(data);
      } catch (err) {
        console.error("Failed to preload proposed roads:", err);
      }
    };

    fetchData();

    const toggle = () => setVisible((prev) => !prev);
    window.addEventListener("toggleProposedRoads", toggle);
    return () => window.removeEventListener("toggleProposedRoads", toggle);
  }, []);

  // 🗺️ Add/Update layer on map
  useEffect(() => {
    const map = window.__MAPBOX_INSTANCE__;
    if (!map || !proposedRoads) return;

    if (!map.getSource("proposed-roads")) {
      map.addSource("proposed-roads", {
        type: "geojson",
        data: proposedRoads,
      });

      map.addLayer({
        id: "proposed-roads-line",
        type: "line",
        source: "proposed-roads",
        layout: {
          visibility: visible ? "visible" : "none",
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

      map.on("click", "proposed-roads-line", (e) => {
        const feature = e.features[0];
        const layerName = feature.properties?.layer || "Unknown Layer";

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<strong>Layer:</strong> ${layerName}`)
          .addTo(map);
      });

      map.on("mouseenter", "proposed-roads-line", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "proposed-roads-line", () => {
        map.getCanvas().style.cursor = "";
      });
    } else {
      map.setLayoutProperty(
        "proposed-roads-line",
        "visibility",
        visible ? "visible" : "none"
      );
    }
  }, [proposedRoads, visible]);

  return (
    <>
      {visible && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "#1a1a1a",
            color: "#fff",
            padding: "10px 12px",
            borderRadius: "8px",
            fontSize: "15px",
            zIndex: 999,
            maxWidth: 250,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <strong style={{ display: "block", marginBottom: 6 }}>
            Proposed Roads Legend
          </strong>
          {legendItems.map((item, idx) => (
            <div
              key={idx}
              style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
            >
              <span
                style={{
                  width: 16,
                  height: 4,
                  backgroundColor: item.color,
                  marginRight: 8,
                }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProposedRoadsLayer;
