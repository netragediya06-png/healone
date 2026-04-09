import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  PersonStanding,
  BookOpen,
  LogOut,
  Users,
  MessageSquare
} from "lucide-react";

function SpecialistSidebar({ openSidebarToggle, OpenSidebar }) {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ FIXED FUNCTION
  const handleSwitchToUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login-as-user", { // ✅ FIXED URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        alert(data.message || "Switch failed");
      }

    } catch (error) {
      console.log("Switch Error:", error);
      alert("Error switching panel");
    }
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

        <SidebarItem
          to="/specialist"
          icon={LayoutDashboard}
          label="Dashboard"
          active={location.pathname === "/specialist"}
          open={openSidebarToggle}
          menuItem={menuItem}
        />

        <SidebarItem
          to="/specialist/remedies"
          icon={Leaf}
          label="Manage Remedies"
          active={isActive("/specialist/remedies")}
          open={openSidebarToggle}
          menuItem={menuItem}
        />

        <SidebarItem
          to="/specialist/yoga"
          icon={PersonStanding}
          label="Manage Yoga"
          active={isActive("/specialist/yoga")}
          open={openSidebarToggle}
          menuItem={menuItem}
        />

        <SidebarItem
          to="/specialist/programs"
          icon={BookOpen}
          label="Manage Programs"
          active={isActive("/specialist/programs")}
          open={openSidebarToggle}
          menuItem={menuItem}
        />

        <SidebarItem
          to="/specialist/subscriptions"
          icon={Users}
          label="Subscriptions"
          active={isActive("/specialist/subscriptions")}
          open={openSidebarToggle}
          menuItem={menuItem}
        />

        <SidebarItem
          to="/specialist/feedback"
          icon={MessageSquare}
          label="Feedback"
          active={isActive("/specialist/feedback")}
          open={openSidebarToggle}
          menuItem={menuItem}
        />

        {/* ✅ SWITCH TO USER PANEL */}
        <li>
          <button
            onClick={handleSwitchToUser}
            className={`${menuItem} ${
              openSidebarToggle ? "px-4 justify-start" : "justify-center"
            } text-lime-300 hover:bg-green-700 hover:text-white`}
          >
            <Users size={18} />
            {openSidebarToggle && <span>User Panel</span>}
          </button>
        </li>

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

/* Sidebar Item */

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