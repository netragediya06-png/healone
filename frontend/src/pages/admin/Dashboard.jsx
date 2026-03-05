import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/stats")
      .then((res) => {
        console.log("Dashboard Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.log("API ERROR:", err));
  }, []);

  if (!data) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

  const monthlyOrders = data.monthlyOrders || [];
  const remediesByCategory = data.remediesByCategory || [];

  // ===== PIE CHART =====
  const pieData = {
    labels: ["Products", "Orders", "Users", "Remedies"],
    datasets: [
      {
        data: [
          data.totalProducts || 0,
          data.totalOrders || 0,
          data.totalUsers || 0,
          data.totalRemedies || 0,
        ],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"],
      },
    ],
  };

  // ===== ORDER STATUS BAR =====
  const orderStatusData = {
    labels: ["Pending", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Orders",
        data: [
          data.pendingOrders || 0,
          data.completedOrders || 0,
          data.cancelledOrders || 0,
        ],
        backgroundColor: ["#f6c23e", "#1cc88a", "#e74a3b"],
      },
    ],
  };

  // ===== MONTHLY ORDERS =====
  const monthlyData = {
    labels: monthlyOrders.map((m) => `Month ${m._id}`),
    datasets: [
      {
        label: "Monthly Orders",
        data: monthlyOrders.map((m) => m.count),
        borderColor: "#4e73df",
        fill: false,
      },
    ],
  };

  // ===== REMEDIES CATEGORY =====
  const remediesData = {
    labels: remediesByCategory.map((r) => r._id),
    datasets: [
      {
        label: "Remedies",
        data: remediesByCategory.map((r) => r.count),
        backgroundColor: "#36b9cc",
      },
    ],
  };

  return (
    <div style={{ padding: "5px" }}>
      <h2>HealOne Admin Dashboard</h2>

      {/* ===== TOP CARDS ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatCard
          title="Total Products"
          value={data.totalProducts}
          bgColor="#eda5a5"
        />
        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          bgColor="#fefecb"
        />
        <StatCard
          title="Total Users"
          value={data.totalUsers}
          bgColor="#beebf0"
        />
        <StatCard
          title="Total Remedies"
          value={data.totalRemedies}
          bgColor="#c6f0be"
        />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="row">
        <div className="col-6">
          <div style={{ width: "600px", margin: "20px auto" }}>
            <Bar data={orderStatusData} />
          </div>
        </div>

        <div className="col-6">
          <div style={{ width: "250px", margin: "20px auto" }}>
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-6">
          <div style={{ width: "600px", margin: "20px auto" }}>
            <Line data={monthlyData} />
          </div>
        </div>

        <div className="col-6">
          <div style={{ width: "600px", margin: "20px auto" }}>
            <Bar data={remediesData} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Reusable Stat Card Component
========================= */

function StatCard({ title, value, bgColor }) {
  const baseStyle = {
    background: bgColor,
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  return (
    <div
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
        e.currentTarget.style.boxShadow =
          "0 12px 20px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow =
          "0 4px 8px rgba(0,0,0,0.1)";
      }}
    >
      <h3 style={{ fontSize: "28px", margin: "0" }}>{value}</h3>
      <p style={{ marginTop: "8px" }}>{title}</p>
    </div>
  );
}

export default Dashboard;