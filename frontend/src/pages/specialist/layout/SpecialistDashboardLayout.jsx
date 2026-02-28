import { useState } from "react";
import { Outlet } from "react-router-dom";
import SpecialistSidebar from "./SpecialistSidebar";
import "./dashboard.css";

function SpecialistDashboardLayout() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        <SpecialistSidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <main className="main-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SpecialistDashboardLayout;
