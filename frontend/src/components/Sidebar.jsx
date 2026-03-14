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
      className={`sidebar ${openSidebarToggle ? "sidebar-open" : "sidebar-collapsed"
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
        {/* SubCategories */}
        <li className={`sidebar-list-item ${isActive("/admin/subcategories")}`}>
          <Link to="/admin/subcategories">
            <i className="fa-solid fa-layer-group"></i>
            <span className="menu-text">SubCategories</span>
          </Link>
        </li>
        {/* special user */}
        <li className={`sidebar-list-item ${isActive("/admin/specialists")}`}>
          <Link to="/admin/specialists">
            <i className="fa-solid fa-user-doctor"></i>
            <span className="menu-text">Specialists</span>
          </Link>
        </li>
        {/* ✅ NEW USERS MENU */}
        <li className={`sidebar-list-item ${isActive("/admin/users")}`}>
          <Link to="/admin/users">
            <i className="fa-solid fa-users"></i>
            <span className="menu-text">Users</span>
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive("/admin/remedies")}`}>
          <Link to="/admin/remedies">
            <i className="fa-solid fa-leaf"></i>
            <span className="menu-text">Remedies</span>
          </Link>
        </li>
        {/* Wellness Programs */}
        <li className={`sidebar-list-item ${isActive("/admin/programs")}`}>
          <Link to="/admin/programs">
            <i className="fa-solid fa-heart-pulse"></i>
            <span className="menu-text">Wellness Programs</span>
          </Link>
        </li>
        {/* Program Subscriptions */}
        <li className={`sidebar-list-item ${isActive("/admin/subscriptions")}`}>
          <Link to="/admin/subscriptions">
            <i className="fa-solid fa-receipt"></i>
            <span className="menu-text">Subscriptions</span>
          </Link>
        </li>
        <li className={`sidebar-list-item ${isActive("/admin/orders")}`}>
          <Link to="/admin/orders">
            <i className="fa-solid fa-box"></i>
            <span className="menu-text">Manage Orders</span>
          </Link>
        </li>
        {/* <li className={`sidebar-list-item ${isActive("/admin/yoga-services")}`}>
  <Link to="/admin/yoga-services">
    <i className="fa-solid fa-person-running"></i>
    <span className="menu-text">Yoga Services</span>
  </Link>
</li> */}


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
