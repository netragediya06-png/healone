import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaTrash, FaBan } from "react-icons/fa";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const adminId = localStorage.getItem("userId");

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/users",
        { headers: { userid: adminId } }
      );
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlock = async (id) => {
    await axios.put(
      `http://localhost:5000/api/users/block/${id}`,
      {},
      { headers: { userid: adminId } }
    );
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await axios.delete(
      `http://localhost:5000/api/users/${id}`,
      { headers: { userid: adminId } }
    );
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔎 Search + Filter Logic
  const filteredUsers = users
    .filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    )
    .filter((user) => {
      if (filter === "active") return !user.isBlocked;
      if (filter === "blocked") return user.isBlocked;
      return true;
    });

  // 🔢 Counts
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
          filteredUsers.map((user) => (
            <div className="user-item" key={user._id}>
              <div className="user-left">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="avatar"
                  />
                ) : (
                  <FaUserCircle className="avatar-icon" />
                )}

                <div>
                  <h4>{user.fullName}</h4>
                  <p>{user.email}</p>
                </div>
              </div>

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
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUsers;