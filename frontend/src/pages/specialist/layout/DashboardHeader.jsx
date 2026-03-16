import { Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

function DashboardHeader({ OpenSidebar }) {

  const [openProfile, setOpenProfile] = useState(false);

  const name = localStorage.getItem("name");

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

        <h2 className="text-lg font-semibold text-gray-800">
          Dashboard
        </h2>

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

            <img
              src="https://i.pravatar.cc/40"
              className="w-9 h-9 rounded-full border"
              alt="profile"
            />

            <span className="hidden md:block text-sm font-medium text-gray-700">
              {name}
            </span>

            <ChevronDown size={16} className="text-gray-500" />

          </button>


          {/* DROPDOWN */}

          {openProfile && (

            <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg border">

              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                Profile
              </button>

              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                Settings
              </button>

              <button className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 text-sm">
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );
}

export default DashboardHeader;