import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname.startsWith(path) ? "active-link" : "";

  return (
    <aside
      className={`sidebar ${
        openSidebarToggle ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <div className="sidebar-header">
        {openSidebarToggle && <h4>🌿 HealOne Admin</h4>}

        <button className="toggle-btn" onClick={OpenSidebar}>
          {openSidebarToggle ? "⟨" : "⟩"}
        </button>
      </div>

      <ul className="sidebar-list">
        {/* Dashboard */}
        <li className={`sidebar-list-item ${isActive("/admin")}`}>
          <Link to="/admin">
            <i className="fa-solid fa-house"></i>
            <span className="menu-text">Dashboard</span>
          </Link>
        </li>

        {/* Products */}
        <li className={`sidebar-list-item ${isActive("/admin/products")}`}>
          <Link to="/admin/products">
            <i className="fa-solid fa-boxes-packing"></i>
            <span className="menu-text">Products</span>
          </Link>
        </li>

        {/* Categories */}
        <li className={`sidebar-list-item ${isActive("/admin/categories")}`}>
          <Link to="/admin/categories">
            <i className="fa-solid fa-table-list"></i>
            <span className="menu-text">Categories</span>
          </Link>
        </li>
        {/* special user */}
        <li className={`sidebar-list-item ${isActive("/admin/specialists")}`}>
          <Link to="/admin/specialists">
            <i className="fa-solid fa-user-doctor"></i>
            <span className="menu-text">Specialists</span>
          </Link>
        </li>

        {/* Logout */}
        <li className="sidebar-list-item logout-item" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span className="menu-text">Logout</span>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
