import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaUserCircle, FaTrash, FaBan, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./AdminUsers.css";

const AdminUsers = () => {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const adminId = localStorage.getItem("userId");

  /* ======================
     FETCH USERS
  ====================== */

  const fetchUsers = async () => {

    try {

      const { data } = await API.get("/users", {
        headers: { userid: adminId }
      });

      setUsers(data);

    } catch (error) {
      console.error("Error fetching users:", error);
    }

  };

  /* ======================
     BLOCK USER
  ====================== */

  const handleBlock = async (id) => {

    try {

      await API.put(`/users/block/${id}`, {}, {
        headers: { userid: adminId }
      });

      fetchUsers();

    } catch (error) {
      console.error("Error blocking user:", error);
    }

  };

  /* ======================
     DELETE USER
  ====================== */

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    try {

      await API.delete(`/users/${id}`, {
        headers: { userid: adminId }
      });

      fetchUsers();

    } catch (error) {
      console.error("Error deleting user:", error);
    }

  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ======================
     SEARCH + FILTER
  ====================== */

  const filteredUsers = users
    .filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    )
    .filter((user) => {

      if (filter === "active") return !user.isBlocked;
      if (filter === "blocked") return user.isBlocked;
      return true;

    });

  /* ======================
     COUNTS
  ====================== */

  const activeCount = users.filter((u) => !u.isBlocked).length;
  const blockedCount = users.filter((u) => u.isBlocked).length;

  return (

    <div className="users-container">

      {/* HEADER */}

      <div className="users-header">

        <h2>Users</h2>

        <span className="total-badge">
          {users.length} Total Users
        </span>

      </div>

      {/* SEARCH + FILTER */}

      <div className="users-controls">

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="filter-wrapper">

          <button
            className={`filter-btn ${filter === "all" ? "selected" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({users.length})
          </button>

          <button
            className={`filter-btn ${filter === "active" ? "selected" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active ({activeCount})
          </button>

          <button
            className={`filter-btn ${filter === "blocked" ? "selected" : ""}`}
            onClick={() => setFilter("blocked")}
          >
            Blocked ({blockedCount})
          </button>

        </div>

      </div>

      {/* USER LIST */}

      <div className="users-list">

        {filteredUsers.length === 0 ? (

          <div className="empty-state">
            No users found.
          </div>

        ) : (

          filteredUsers.map((user) => {

            const age = user.dateOfBirth
              ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
              : null;

            return (

              <div className="user-item" key={user._id}>

                {/* LEFT SIDE */}

                <div className="user-left">

                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt="profile"
                      className="avatar"
                    />
                  ) : (
                    <FaUserCircle className="avatar-icon" />
                  )}

                  <div className="user-info">

                    <h4>{user.fullName}</h4>

                    <p className="email">
                      {user.email}
                    </p>

                    {user.phone && (
                      <p className="meta">
                        <FaPhone /> {user.phone}
                      </p>
                    )}

                    {(user.gender || age) && (
                      <p className="meta">
                        {user.gender || ""} {age ? `| ${age} yrs` : ""}
                      </p>
                    )}

                    {user.location?.city && (
                      <p className="meta">
                        <FaMapMarkerAlt /> {user.location.city}, {user.location.state}
                      </p>
                    )}

                  </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="user-right">

                  <span
                    className={`status ${
                      user.isBlocked ? "blocked" : "active"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>

                  <button
                    className="icon-btn"
                    onClick={() => handleBlock(user._id)}
                  >
                    <FaBan />
                  </button>

                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(user._id)}
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>

            );

          })

        )}  

      </div>

    </div>

  );

};

export default AdminUsers;