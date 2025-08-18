import { useState } from "react";
import PortfolioLog from "./Portfolio/PortfolioLog";
import GanttLog from "./Gantt/GanttLog";
import CrudLog from "./CRUD/CrudLog";

export default function LogManager({ onBack }) {
  const [activeTab, setActiveTab] = useState("portfolio");

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const renderActiveLog = () => {
    switch (activeTab) {
      case "portfolio":
        return (
          <PortfolioLog
            onBack={onBack}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        );
      case "gantt":
        return (
          <GanttLog
            onBack={onBack}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        );
      case "crud":
        return (
          <CrudLog
            onBack={onBack}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        );
      default:
        return (
          <PortfolioLog
            onBack={onBack}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        );
    }
  };

  return renderActiveLog();
}
