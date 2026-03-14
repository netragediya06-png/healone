import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../App.css";

function DashboardLayout() {

  const navigate = useNavigate();

  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  // Fetch admin data from localStorage
  useEffect(() => {

    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    setAdminName(name);
    setAdminEmail(email);

    const demoNotifications = [
      { _id: 1, title: "New Product Added", message: "Ashwagandha Capsules added" },
      { _id: 2, title: "New Order", message: "Order #1023 received" },
      { _id: 3, title: "New User Registered", message: "Rahul created account" },
    ];

    setNotifications(demoNotifications);

  }, []);

  const closeModal = () => {
    setModalType(null);
  };

  // Logout function
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");

    navigate("/login");

  };

  return (
    <div className="dashboard">

      <div className="dashboard-body">

        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />

        <div className="main-section">

          {/* HEADER */}

          <div className="admin-header">

            <div className="header-left">
              <h3>HealOne Admin</h3>
            </div>

            <div className="header-right">

              {/* Notifications */}

              <div
                className="icon-circle"
                onClick={() => setShowNotif(!showNotif)}
              >

                <i className="fa-solid fa-bell"></i>

                {notifications.length > 0 && (
                  <span className="notif-badge">
                    {notifications.length}
                  </span>
                )}

                {showNotif && (
                  <div className="notif-dropdown">

                    {notifications.map((n) => (
                      <div key={n._id} className="notif-item">
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                      </div>
                    ))}

                  </div>
                )}

              </div>

              {/* PROFILE */}

              <div
                className="admin-profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >

                <img
                  src="https://i.pravatar.cc/40"
                  alt="admin"
                />

                <span>{adminName}</span>

                <i className="fa-solid fa-chevron-down small-arrow"></i>

                {showProfileMenu && (
                  <div className="profile-dropdown">

                    <div
                      className="profile-item"
                      onClick={() => setModalType("profile")}
                    >
                      <i className="fa-solid fa-user"></i> View Profile
                    </div>

                    <div
                      className="profile-item"
                      onClick={() => setModalType("edit")}
                    >
                      <i className="fa-solid fa-pen"></i> Edit Profile
                    </div>

                    <div
                      className="profile-item"
                      onClick={() => setModalType("password")}
                    >
                      <i className="fa-solid fa-key"></i> Change Password
                    </div>

                    {/* Logout */}

                    <div
                      className="profile-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fa-solid fa-right-from-bracket"></i> Logout
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

          <main className="main-container">
            <Outlet />
          </main>

        </div>

      </div>

      {/* VIEW PROFILE MODAL */}

      {modalType === "profile" && (
        <div className="modal fade show d-block">

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  Admin Profile
                </h5>

                <button
                  className="btn-close"
                  onClick={closeModal}
                ></button>

              </div>

              <div className="modal-body text-center">

                <img
                  src="https://i.pravatar.cc/100"
                  className="rounded-circle mb-3"
                  alt="profile"
                />

                <h5>{adminName}</h5>
                <p>{adminEmail}</p>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* EDIT PROFILE MODAL */}

      {modalType === "edit" && (
        <div className="modal fade show d-block">

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  Edit Profile
                </h5>

                <button
                  className="btn-close"
                  onClick={closeModal}
                ></button>

              </div>

              <div className="modal-body">

                <form>

                  <div className="mb-3">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={adminName}
                    />
                  </div>

                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      defaultValue={adminEmail}
                    />
                  </div>

                  <div className="mb-3">
                    <label>Profile Photo</label>
                    <input
                      type="file"
                      className="form-control"
                    />
                  </div>

                  <button className="btn btn-success w-100">
                    Update Profile
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}

      {modalType === "password" && (
        <div className="modal fade show d-block">

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  Change Password
                </h5>

                <button
                  className="btn-close"
                  onClick={closeModal}
                ></button>

              </div>

              <div className="modal-body">

                <form>

                  <div className="mb-3">
                    <label>Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label>New Password</label>
                    <input
                      type="password"
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                    />
                  </div>

                  <button className="btn btn-primary w-100">
                    Update Password
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default DashboardLayout;