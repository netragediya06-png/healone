import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminYogaServices = () => {
  const token = localStorage.getItem("token");
  const [yogaList, setYogaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchYoga();
  }, [statusFilter]);

  const fetchYoga = async () => {
    try {
      setLoading(true);

      // Use full backend URL
      const res = await axios.get("http://localhost:5000/api/yoga", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = res.data || [];

      // Filter by status if needed
      if (statusFilter !== "All") {
        data = data.filter((y) => y.status === statusFilter);
      }

      setYogaList(data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch yoga error:", error);
      setYogaList([]);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/yoga/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchYoga();
    } catch (error) {
      console.error("Update status error:", error);
      alert("Error updating status");
    }
  };

  const deleteYoga = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/yoga/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchYoga();
    } catch (error) {
      console.error("Delete yoga error:", error);
      alert("Error deleting yoga");
    }
  };

  const stats = {
    total: yogaList.length,
    pending: yogaList.filter((y) => y.status === "Pending").length,
    approved: yogaList.filter((y) => y.status === "Approved").length,
    rejected: yogaList.filter((y) => y.status === "Rejected").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Yoga Management</h2>
        <p className="text-sm text-gray-500">
          Review and manage specialist yoga submissions
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, key: "All", color: "bg-gray-100" },
          { label: "Pending", value: stats.pending, key: "Pending", color: "bg-yellow-100" },
          { label: "Approved", value: stats.approved, key: "Approved", color: "bg-green-100" },
          { label: "Rejected", value: stats.rejected, key: "Rejected", color: "bg-red-100" },
        ].map((card) => (
          <div
            key={card.key}
            onClick={() => setStatusFilter(card.key)}
            className={`p-4 rounded-lg cursor-pointer text-center
              ${card.color} ${statusFilter === card.key ? "ring-2 ring-green-500" : ""}`}
          >
            <h4 className="text-xl font-bold">{card.value}</h4>
            <span className="text-sm text-gray-600">{card.label}</span>
          </div>
        ))}
      </div>

      {/* Yoga grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">Loading yoga...</div>
        ) : (
          yogaList.map((yoga) => (
            <div key={yoga._id} className="bg-white rounded-xl shadow p-4">
              {yoga.image && (
                <img
                  src={yoga.image}
                  alt={yoga.title}
                  className="w-full h-28 object-cover rounded"
                />
              )}
              <h3 className="font-semibold text-sm mt-2">{yoga.title}</h3>
              <p className="text-xs text-gray-500">{yoga.category}</p>
              <p className="text-xs text-gray-400">
                {yoga.duration} min • {yoga.difficulty}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  yoga.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : yoga.status === "Rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {yoga.status || "Pending"}
              </span>

              {yoga.status === "Pending" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateStatus(yoga._id, "Approved")}
                    className="bg-green-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(yoga._id, "Rejected")}
                    className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              <button
                onClick={() => deleteYoga(yoga._id)}
                className="bg-gray-500 text-white px-2 py-1 mt-2 text-xs rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminYogaServices;