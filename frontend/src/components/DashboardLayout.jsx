import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell } from "lucide-react";

function DashboardLayout() {

  const navigate = useNavigate();

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  /* ================= ADMIN DATA + DEMO NOTIFICATIONS ================= */

  useEffect(() => {

    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    setAdminName(name);
    setAdminEmail(email);

    const demoNotifications = [
      { _id: 1, title: "New Product Added", message: "Ashwagandha Capsules added", read: false },
      { _id: 2, title: "New Order", message: "Order #1023 received", read: false },
      { _id: 3, title: "New User Registered", message: "Rahul created account", read: false },
    ];

    setNotifications(demoNotifications);
    setUnreadCount(demoNotifications.length);

    const interval = setInterval(() => {

      const newNotif = {
        _id: Date.now(),
        title: "System Update",
        message: "New activity detected",
        read: false
      };

      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);

    }, 30000);

    return () => clearInterval(interval);

  }, []);

  /* ================= CLICK OUTSIDE HANDLER ================= */

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  /* ================= FUNCTIONS ================= */

  const closeModal = () => setModalType(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const markAsRead = (id) => {

    const updated = notifications.map((n) =>
      n._id === id ? { ...n, read: true } : n
    );

    setNotifications(updated);

    const unread = updated.filter((n) => !n.read).length;
    setUnreadCount(unread);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* SIDEBAR */}

      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />

      {/* MAIN */}

      <div
  className={`flex flex-col flex-1 transition-all duration-300 ${
  openSidebarToggle ? "ml-[220px]" : "ml-[70px]"
}`}
>

        {/* HEADER */}

        <header className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">

          {/* LEFT */}

          <div className="flex items-center gap-4">

            <button
              onClick={OpenSidebar}
              className="text-gray-600 hover:text-green-600 text-lg"
            >
              <i className="fa-solid fa-bars"></i>
            </button>

            <h2 className="text-lg font-semibold text-gray-800">
              HealOne Admin
            </h2>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-6">

            {/* NOTIFICATIONS */}

            <div ref={notifRef} className="relative">

              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
              >

                <Bell className={`w-6 h-6 text-gray-700 ${unreadCount > 0 ? "animate-bounce" : ""}`} />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow">
                    {unreadCount}
                  </span>
                )}

              </button>

              {showNotif && (
                <div className="absolute right-0 mt-3 w-72 bg-white shadow-xl rounded-xl border z-50 overflow-hidden">

                  <div className="p-3 border-b font-semibold text-sm bg-gray-50">
                    Notifications
                  </div>

                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markAsRead(n._id)}
                      className={`px-4 py-3 border-b cursor-pointer
                      ${n.read ? "bg-white" : "bg-blue-50"}
                      hover:bg-gray-50`}
                    >

                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-gray-500">{n.message}</p>

                      {!n.read && (
                        <span className="text-[10px] text-blue-600 font-medium">
                          Unread
                        </span>
                      )}

                    </div>
                  ))}

                </div>
              )}

            </div>

            {/* PROFILE */}

            <div ref={profileRef} className="relative">

              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-gray-100 px-2 py-1 rounded-lg"
              >

                <img
                  src="https://i.pravatar.cc/40"
                  className="w-9 h-9 rounded-full border"
                  alt="admin"
                />

                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {adminName}
                </span>

                <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>

              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-52 bg-white shadow-xl rounded-xl border z-50 overflow-hidden">

                  <button
                    onClick={() => setModalType("profile")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => setModalType("edit")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={() => setModalType("password")}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
                  >
                    Change Password
                  </button>

                  <div className="border-t"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-500 text-sm"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>

          </div>

        </header>

        {/* PAGE */}

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

      {/* PROFILE MODAL */}

      {modalType === "profile" && (
        <ModalWrapper closeModal={closeModal} title="Admin Profile">

          <div className="text-center">

            <img
              src="https://i.pravatar.cc/100"
              className="w-24 h-24 rounded-full mx-auto mb-4 border"
              alt="profile"
            />

            <h4 className="text-lg font-semibold">{adminName}</h4>
            <p className="text-gray-500">{adminEmail}</p>

          </div>

        </ModalWrapper>
      )}

    </div>
  );
}

/* MODAL */

function ModalWrapper({ title, children, closeModal }) {

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6">

        <div className="flex justify-between items-center mb-4">

          <h3 className="font-semibold text-lg">{title}</h3>

          <button onClick={closeModal}>
            <i className="fa-solid fa-xmark"></i>
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}

export default DashboardLayout;