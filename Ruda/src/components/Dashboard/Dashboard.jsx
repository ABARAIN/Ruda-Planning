import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import DashboardHeader from "./DashboardHeader/DashboardHeader";
import DashboardLayout from "./DashboardLayout/DashboardLayout";
import "./Dashboard.css";

const Dashboard = () => {
  function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  }
  const [features, setFeatures] = useState([]);
  const [colorMap, setColorMap] = useState({});

  const [selectedPhases, setSelectedPhases] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    // Load the same dataset MainMap uses so dropdowns match
    const API_URL = "https://ruda-planning.onrender.com/api/all";
    axios
      .get(API_URL)
      .then((res) => {
        const feats = res.data.features || [];
        setFeatures(feats);

        // Build initial color map similar to MainMapPage
        const names = [
          ...new Set(feats.map((f) => f.properties?.name).filter(Boolean)),
        ];

        const layerNames = [
          "Charhar Bhag",
          "CB Enclave",
          "Access Roads",
          "M Toll Plaze",
          "Jhoke",
        ];

        setColorMap((prev) => {
          const newMap = { ...prev };
          [...names, ...layerNames].forEach((name) => {
            if (!newMap[name]) newMap[name] = getRandomColor();
          });
          return newMap;
        });
      })
      .catch((err) => console.error("Dashboard: failed to load features", err));
  }, []);

  const handleColorChange = (name, color) =>
    setColorMap((m) => ({ ...m, [name]: color }));

  return (
    <div
      className="dashboard-container"
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        background:
          "radial-gradient(farthest-side ellipse at 10% 0, #333867 20%, #17193b)",
      }}
    >
      {/* Sidebar */}
      <DashboardSidebar
        features={features}
        colorMap={colorMap}
        onColorChange={handleColorChange}
        selectedPhases={selectedPhases}
        setSelectedPhases={setSelectedPhases}
        selectedPackages={selectedPackages}
        setSelectedPackages={setSelectedPackages}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedProjects={selectedProjects}
        setSelectedProjects={setSelectedProjects}
      />

      {/* Right section (Header + Layout) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "calc(100% - 17%)",
          minWidth: 0,
        }}
      >
        <DashboardHeader />
        <DashboardLayout
          features={features}
          colorMap={colorMap}
          selectedPhases={selectedPhases}
          setSelectedPhases={setSelectedPhases}
          selectedPackages={selectedPackages}
          setSelectedPackages={setSelectedPackages}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedProjects={selectedProjects}
          setSelectedProjects={setSelectedProjects}
          onColorChange={handleColorChange}
        />
      </div>
    </div>
  );
};

export default Dashboard;
