import { Link, useNavigate, useLocation } from "react-router-dom";

function SpecialistSidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
        {openSidebarToggle && <h4>🌿 HealOne Specialist</h4>}

        <button className="toggle-btn" onClick={OpenSidebar}>
          {openSidebarToggle ? "⟨" : "⟩"}
        </button>
      </div>

      <ul className="sidebar-list">

        {/* Dashboard */}
        <li className={`sidebar-list-item ${isActive("/specialist")}`}>
          <Link to="/specialist">
            <i className="fa-solid fa-house"></i>
            <span className="menu-text">Dashboard</span>
          </Link>
        </li>

        {/* My Remedies */}
        <li className={`sidebar-list-item ${isActive("/specialist/remedies")}`}>
          <Link to="/specialist/remedies">
            <i className="fa-solid fa-leaf"></i>
            <span className="menu-text">My Remedies</span>
          </Link>
        </li>

        {/* Add Remedy */}
        <li className={`sidebar-list-item ${isActive("/specialist/add-remedy")}`}>
          <Link to="/specialist/add-remedy">
            <i className="fa-solid fa-plus"></i>
            <span className="menu-text">Add Remedy</span>
          </Link>
        </li>

        {/* My Yoga */}
        <li className={`sidebar-list-item ${isActive("/specialist/yoga")}`}>
          <Link to="/specialist/yoga">
            <i className="fa-solid fa-person-walking"></i>
            <span className="menu-text">My Yoga</span>
          </Link>
        </li>

        {/* My Programs */}
        <li className={`sidebar-list-item ${isActive("/specialist/programs")}`}>
          <Link to="/specialist/programs">
            <i className="fa-solid fa-book-open"></i>
            <span className="menu-text">My Programs</span>
          </Link>
        </li>

        {/* Logout */}
        <li
          className="sidebar-list-item logout-item"
          onClick={handleLogout}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span className="menu-text">Logout</span>
        </li>

      </ul>
    </aside>
  );
}

export default SpecialistSidebar;
