import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaUserCircle, FaTrash, FaBan, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

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

    <div className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Users
        </h2>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          {users.length} Total Users
        </span>

      </div>

      {/* SEARCH + FILTER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-green-500"
        />

        <div className="flex gap-2 flex-wrap">

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm
              ${filter === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"}
            `}
          >
            All ({users.length})
          </button>

          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg text-sm
              ${filter === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"}
            `}
          >
            Active ({activeCount})
          </button>

          <button
            onClick={() => setFilter("blocked")}
            className={`px-4 py-2 rounded-lg text-sm
              ${filter === "blocked"
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"}
            `}
          >
            Blocked ({blockedCount})
          </button>

        </div>

      </div>

      {/* USER LIST */}

      <div className="space-y-4">

        {filteredUsers.length === 0 ? (

          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
            No users found.
          </div>

        ) : (

          filteredUsers.map((user) => {

            const age = user.dateOfBirth
              ? new Date().getFullYear() -
                new Date(user.dateOfBirth).getFullYear()
              : null;

            return (

              <div
                key={user._id}
                className="flex justify-between items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >

                {/* LEFT */}

                <div className="flex items-center gap-4">

                  {user.profilePhoto ? (

                    <img
                      src={user.profilePhoto}
                      alt="profile"
                      className="w-14 h-14 rounded-full object-cover"
                    />

                  ) : (

                    <FaUserCircle className="text-4xl text-gray-400" />

                  )}

                  <div>

                    <h4 className="font-semibold text-gray-800">
                      {user.fullName}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>

                    {user.phone && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaPhone /> {user.phone}
                      </p>
                    )}

                    {(user.gender || age) && (
                      <p className="text-xs text-gray-500">
                        {user.gender || ""} {age ? `| ${age} yrs` : ""}
                      </p>
                    )}

                    {user.location?.city && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt /> {user.location.city},{" "}
                        {user.location.state}
                      </p>
                    )}

                  </div>

                </div>

                {/* RIGHT */}

                <div className="flex items-center gap-3">

                  <span
                    className={`px-3 py-1 text-xs rounded-full
                      ${
                        user.isBlocked
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-700"
                      }
                    `}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>

                  <button
                    onClick={() => handleBlock(user._id)}
                    className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
                  >
                    <FaBan />
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
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