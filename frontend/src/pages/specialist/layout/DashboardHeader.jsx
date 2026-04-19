import { Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardHeader({ OpenSidebar }) {
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  // ✅ GET DATA FROM LOCALSTORAGE
  const name = localStorage.getItem("name");
  const profilePhoto = localStorage.getItem("profilePhoto");

  const handleSwitchToUser = () => {
    localStorage.setItem("activeRole", "user");
    navigate("/");
    window.location.reload(); // refresh to apply layout
  };
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        <button
          onClick={OpenSidebar}
          className="text-gray-600 hover:text-green-600 text-lg"
        >
          ☰
        </button>

        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">
        {/* NOTIFICATIONS */}
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-3 hover:bg-gray-100 px-2 py-1 rounded-lg"
          >
            {/* ✅ DYNAMIC PROFILE IMAGE */}
            <img
              src={profilePhoto || "https://i.pravatar.cc/40"}
              className="w-9 h-9 rounded-full border object-cover"
              alt="profile"
            />

            {/* ✅ NAME */}
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {name || "User"}
            </span>

            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {/* DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl border z-50 overflow-hidden">
              {/* PROFILE */}
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-100 text-sm"
              >
                👤 <span>Profile</span>
              </button>

              {/* SETTINGS */}
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-100 text-sm"
              >
                ⚙️ <span>Settings</span>
              </button>

              {/* DIVIDER */}
              <div className="border-t my-1"></div>

              {/* SWITCH ROLE */}
              <button
                onClick={handleSwitchToUser}
                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-blue-50 text-blue-600 text-sm font-medium transition"
              >
                🔁 <span>Switch to User</span>
              </button>

              {/* DIVIDER */}
              <div className="border-t my-1"></div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-red-500 text-sm font-medium"
              >
                🚪 <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
