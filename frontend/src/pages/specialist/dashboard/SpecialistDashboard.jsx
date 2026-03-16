import { useEffect, useState } from "react";
import axios from "axios";

function SpecialistDashboard() {

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/remedies/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const remedies = res.data;

      const total = remedies.length;
      const pending = remedies.filter(r => r.status === "Pending").length;
      const approved = remedies.filter(r => r.status === "Approved").length;
      const rejected = remedies.filter(r => r.status === "Rejected").length;

      setStats({ total, pending, approved, rejected });

    } catch (error) {
      console.error("Dashboard error:", error);
    }

  };

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          🌿 Specialist Dashboard
        </h2>
        <p className="text-gray-500 mt-1">
          Track your remedies and monitor approval progress
        </p>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow-sm p-6 text-center border">
          <h5 className="text-gray-600 text-sm mb-2">
            My Remedies
          </h5>
          <p className="text-3xl font-bold text-green-600">
            {stats.total}
          </p>
          <span className="text-xs text-gray-400">
            Total submitted
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 text-center border">
          <h5 className="text-gray-600 text-sm mb-2">
            Pending
          </h5>
          <p className="text-3xl font-bold text-yellow-500">
            {stats.pending}
          </p>
          <span className="text-xs text-gray-400">
            Awaiting approval
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 text-center border">
          <h5 className="text-gray-600 text-sm mb-2">
            Approved
          </h5>
          <p className="text-3xl font-bold text-green-600">
            {stats.approved}
          </p>
          <span className="text-xs text-gray-400">
            Published remedies
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 text-center border">
          <h5 className="text-gray-600 text-sm mb-2">
            Rejected
          </h5>
          <p className="text-3xl font-bold text-red-500">
            {stats.rejected}
          </p>
          <span className="text-xs text-gray-400">
            Needs revision
          </span>
        </div>

      </div>

    </div>
  );
}

export default SpecialistDashboard;