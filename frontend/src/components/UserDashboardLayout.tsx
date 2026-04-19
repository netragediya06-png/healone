import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  Activity
} from "lucide-react";

const UserDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      label: "Profile",
      path: "/account/profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      label: "My Orders",
      path: "/account/my-orders",
      icon: <Package className="w-4 h-4" />,
    },
    {
      label: "Wishlist",
      path: "/account/wishlist",
      icon: <Heart className="w-4 h-4" />,
    },
    {
      label: "Programs",
      path: "/account/programs",
      icon: <Activity className="w-4 h-4" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-white rounded-2xl shadow p-5 h-fit">

        <h2 className="font-semibold mb-4 text-gray-800">
          My Account
        </h2>

        <div className="space-y-2 text-sm">

          {menu.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}

        </div>
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div className="flex-1">
        <Outlet />
      </div>

    </div>
  );
};

export default UserDashboardLayout;