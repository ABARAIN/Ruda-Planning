import React from "react";
import { Routes, Route } from "react-router-dom";
import MainMapPage from "./components/MainMap/MainMapPage";
import DashboardRTWExact from "./components/RTWMap/DashboardRTW";
import RTWMap from "./components/RTWMap/RTWMap";
import GeoDataManager from "./components/MainMap/CRUD/GeoDataManager";
import Portfolio from "./components/MainMap/Portfolio/Portfolio";
import RUDADevelopmentPlan from "./components/MainMap/Gantt/RUDADevelopmentPlan";
import PhaseTwoGanttChart from "./components/MainMap/Gantt/PhaseTwoGanttChart";
import PCrud from "./components/MainMap/Portfolio/PCrud";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainMapPage />} />
      <Route path="/map" element={<RTWMap />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/crud" element={<GeoDataManager />} />
      <Route path="/details/:name" element={<DashboardRTWExact />} />
      <Route path="/gantt" element={<RUDADevelopmentPlan />} />
      <Route path="/phase2-gantt" element={<PhaseTwoGanttChart />} />
      <Route path="/portfolio-crud" element={<PCrud />} />
    </Routes>
  );
};

export default AppRoutes;
