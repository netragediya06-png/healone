import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminYogaServices = () => {
  const [services, setServices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const adminId = localStorage.getItem("userId");

  // ===============================
  // Fetch Yoga Services
  // ===============================
  const fetchServices = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/yoga-services?status=${statusFilter}`,
        {
          headers: { userid: adminId },
        }
      );

      setServices(data.services);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // ===============================
  // Update Status
  // ===============================
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/yoga-services/${id}/status`,
        { status },
        {
          headers: { userid: adminId },
        }
      );
      fetchServices();
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  // ===============================
  // Delete Service
  // ===============================
  const deleteService = async (id) => {
    if (!window.confirm("Delete this yoga service?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/yoga-services/${id}`,
        {
          headers: { userid: adminId },
        }
      );
      fetchServices();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [statusFilter]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Yoga Services</h2>

      {/* Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ marginBottom: "15px", padding: "6px" }}
      >
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Mode</th>
            <th style={thStyle}>Specialist</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {services?.map((service) => (
            <tr key={service._id}>
              <td style={tdStyle}>{service.title}</td>
              <td style={tdStyle}>₹{service.price}</td>
              <td style={tdStyle}>{service.mode}</td>
              <td style={tdStyle}>
                {service.createdBy?.fullName}
              </td>
              <td style={tdStyle}>{service.status}</td>
              <td style={tdStyle}>
                {service.status !== "Approved" && (
                  <button
                    onClick={() =>
                      updateStatus(service._id, "Approved")
                    }
                    style={approveBtn}
                  >
                    Approve
                  </button>
                )}

                {service.status !== "Rejected" && (
                  <button
                    onClick={() =>
                      updateStatus(service._id, "Rejected")
                    }
                    style={rejectBtn}
                  >
                    Reject
                  </button>
                )}

                <button
                  onClick={() => deleteService(service._id)}
                  style={deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles
const thStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px",
};

const approveBtn = {
  marginRight: "5px",
  background: "green",
  color: "white",
  padding: "5px 10px",
  cursor: "pointer",
};

const rejectBtn = {
  marginRight: "5px",
  background: "orange",
  color: "white",
  padding: "5px 10px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "red",
  color: "white",
  padding: "5px 10px",
  cursor: "pointer",
};

export default AdminYogaServices;