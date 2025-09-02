import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainMapPage from "./components/MainMap/MainMapPage";
import DashboardRTWExact from "./components/RTWMap/DashboardRTW";
import RTWMap from "./components/RTWMap/RTWMap";
import GeoDataManager from "./components/MainMap/CRUD/GeoDataManager";
import Portfolio from "./components/MainMap/Portfolio/Portfolio";
import RUDADevelopmentPlan from "./components/MainMap/Gantt/RUDADevelopmentPlan";
import PhaseTwoGanttChart from "./components/MainMap/Gantt/PhaseTwoGanttChart";
import PCrud from "./components/MainMap/Portfolio/PCrud";
import HierarchicalDataComponent from "./components/MainMap/Gantt/HierarchicalDataComponent";
import ProjectMilestone from "./components/MainMap/ProjectMilestone";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainMapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <RTWMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crud"
        element={
          <ProtectedRoute>
            <GeoDataManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/details/:name"
        element={
          <ProtectedRoute>
            <DashboardRTWExact />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gantt"
        element={
          <ProtectedRoute>
            <RUDADevelopmentPlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/phase2-gantt"
        element={
          <ProtectedRoute>
            <PhaseTwoGanttChart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio-crud"
        element={
          <ProtectedRoute>
            <PCrud />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hierarchical-gantt"
        element={
          <ProtectedRoute>
            <HierarchicalDataComponent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/milestones"
        element={
          <ProtectedRoute>
            <ProjectMilestone />
          </ProtectedRoute>
        }
      />

      {/* Redirect to login if not authenticated, otherwise to main page */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
