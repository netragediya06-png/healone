import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  PersonStanding,
  BookOpen,
  LogOut
} from "lucide-react";

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

  const isActive = (path) => location.pathname.startsWith(path);

  const menuItem =
    "flex items-center gap-3 py-2 text-sm rounded-lg transition-all duration-200";

  return (
    <aside
      className={`bg-[#0f3d2c] text-slate-200 h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 ${
        openSidebarToggle ? "w-[220px]" : "w-[70px]"
      }`}
    >

      {/* HEADER */}

      <div className="flex items-center justify-between px-4 py-4 mb-6">

        {openSidebarToggle && (
          <h4 className="text-white font-semibold text-sm">
            🌿 HealOne Specialist
          </h4>
        )}

        <button
          onClick={OpenSidebar}
          className="bg-lime-500 hover:bg-white hover:text-lime-500 text-white w-7 h-7 rounded-md text-sm"
        >
          {openSidebarToggle ? "⟨" : "⟩"}
        </button>

      </div>

      {/* MENU */}

      <ul className="flex flex-col gap-2 flex-1 px-2">

        {/* DASHBOARD */}

        <SidebarItem
          to="/specialist"
          icon={LayoutDashboard}
          label="Dashboard"
          active={isActive("/specialist")}
          open={openSidebarToggle}
          menuItem={menuItem}
        />

        {/* REMEDIES */}

        <SidebarItem
          to="/specialist/remedies"
          icon={Leaf}
          label="Manage Remedies"
          active={isActive("/specialist/remedies")}
          open={openSidebarToggle}
          menuItem={menuItem}
        />

        {/* YOGA */}

        <SidebarItem
          to="/specialist/yoga"
          icon={PersonStanding}
          label="Manage Yoga"
          active={isActive("/specialist/yoga")}
          open={openSidebarToggle}
          menuItem={menuItem}
        />

        {/* PROGRAMS */}

        <SidebarItem
          to="/specialist/programs"
          icon={BookOpen}
          label="Manage Programs"
          active={isActive("/specialist/programs")}
          open={openSidebarToggle}
          menuItem={menuItem}
        />

        {/* LOGOUT */}

        <li>
          <button
            onClick={handleLogout}
            className={`${menuItem} ${
              openSidebarToggle ? "px-4 justify-start" : "justify-center"
            } text-red-400 hover:bg-green-700 hover:text-white`}
          >
            <LogOut size={18} />
            {openSidebarToggle && <span>Logout</span>}
          </button>
        </li>

      </ul>

    </aside>
  );
}


/* Sidebar Menu Item */

function SidebarItem({ to, icon: Icon, label, active, open, menuItem }) {

  return (
    <li>

      <Link
        to={to}
        className={`${menuItem} ${
          open ? "px-4 justify-start" : "justify-center"
        } ${
          active
            ? "bg-green-700 text-white relative"
            : "text-slate-200 hover:bg-green-700 hover:text-white"
        }`}
      >

        {/* ACTIVE LEFT BAR */}

        {active && open && (
          <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-[4px] h-5 bg-lime-400 rounded-full"></span>
        )}

        <Icon size={18} />

        {open && <span>{label}</span>}

      </Link>

    </li>
  );
}

export default SpecialistSidebar;