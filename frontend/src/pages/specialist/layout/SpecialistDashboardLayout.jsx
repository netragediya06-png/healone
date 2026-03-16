import { useState } from "react";
import { Outlet } from "react-router-dom";
import SpecialistSidebar from "./SpecialistSidebar";
import DashboardHeader from "./DashboardHeader";

function SpecialistDashboardLayout() {

  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (

    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}

      <SpecialistSidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />

      {/* MAIN CONTENT */}

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          openSidebarToggle ? "ml-[220px]" : "ml-[70px]"
        }`}
      >
        <DashboardHeader OpenSidebar={OpenSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>

  );
}

export default SpecialistDashboardLayout;