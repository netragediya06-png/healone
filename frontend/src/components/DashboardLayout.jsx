import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
// import "../pages/admin/Dashboaed.css";
import "../App.css";

function DashboardLayout() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />

        <div className="main-section">

          {/* 🔵 Admin Header */}
          <div className="admin-header">
  <div className="header-left">
    <div className="search-wrapper">
      <i className="fa-solid fa-magnifying-glass search-icon"></i>
      <input
        type="text"
        placeholder="Search products, orders..."
        className="admin-search"
      />
    </div>
  </div>

  <div className="header-right">
    <div className="icon-circle">
      <i className="fa-solid fa-bell"></i>
      <span className="notif-badge">3</span>
    </div>

    <div className="admin-profile">
      <img
        src="https://i.pravatar.cc/40"
        alt="admin"
      />
      <span>Admin</span>
      <i className="fa-solid fa-chevron-down small-arrow"></i>
    </div>
  </div>
</div>

          <main className="main-container">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
