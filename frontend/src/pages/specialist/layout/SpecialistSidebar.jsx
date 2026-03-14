import { Link, useNavigate, useLocation } from "react-router-dom";

function SpecialistSidebar({ openSidebarToggle, OpenSidebar }) {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");

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

      {/* HEADER */}

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

        {/* ================= REMEDIES ================= */}

        {/* {openSidebarToggle && (
          <li className="sidebar-section-title">
            Remedies
          </li>
        )} */}

        <li className={`sidebar-list-item ${isActive("/specialist/add-remedy")}`}>
          {/* <Link to="/specialist/add-remedy">
            <i className="fa-solid fa-plus"></i>
            <span className="menu-text">Add Remedy</span>
          </Link> */}
        </li>

        <li className={`sidebar-list-item ${isActive("/specialist/remedies")}`}>
          <Link to="/specialist/remedies">
            <i className="fa-solid fa-leaf"></i>
            <span className="menu-text">Manage Remedies</span>
          </Link>
        </li>

        {/* ================= YOGA ================= */}

        {/* {openSidebarToggle && (
          <li className="sidebar-section-title">
            Yoga
          </li>
        )} */}

        <li className={`sidebar-list-item ${isActive("/specialist/add-yoga")}`}>
          {/* <Link to="/specialist/add-yoga">
            <i className="fa-solid fa-plus"></i>
            <span className="menu-text">Add Yoga</span>
          </Link> */}
        </li>

        <li className={`sidebar-list-item ${isActive("/specialist/yoga")}`}>
          <Link to="/specialist/yoga-services">
            <i className="fa-solid fa-person-walking"></i>
            <span className="menu-text">Manage Yoga</span>
          </Link>
        </li>

        {/* ================= WELLNESS PROGRAM ================= */}

        {/* {openSidebarToggle && (
          <li className="sidebar-section-title">
            Wellness Programs
          </li>
        )} */}

        <li className={`sidebar-list-item ${isActive("/specialist/add-program")}`}>
          {/* <Link to="/specialist/add-program">
            <i className="fa-solid fa-plus"></i>
            <span className="menu-text">Add Program</span>
          </Link> */}
        </li>

        <li className={`sidebar-list-item ${isActive("/specialist/programs")}`}>
          <Link to="/specialist/programs">
            <i className="fa-solid fa-book-open"></i>
            <span className="menu-text">Manage Programs</span>
          </Link>
        </li>

        {/* ================= LOGOUT ================= */}

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