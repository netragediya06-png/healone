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
      const res = await axios.get(
        "http://localhost:5000/api/remedies/my",
        {
          headers: {
            userid: localStorage.getItem("userId"),
            role: localStorage.getItem("role"),
          },
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
    <div className="spec-dashboard">

      <div className="spec-wrapper">

        {/* 🌿 Header Section */}
        <div className="spec-header">
          <h2>🌿 Specialist Dashboard</h2>
          <p>Track your remedies and monitor approval progress</p>
        </div>

        {/* 📊 Stats Cards */}
        <div className="row g-4">

          <div className="col-md-3">
            <div className="card shadow-sm border-0 spec-card">
              <div className="card-body text-center">
                <h5 className="card-title">My Remedies</h5>
                <p className="card-text spec-number text-success">
                  {stats.total}
                </p>
                <span className="text-muted">Total submitted</span>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0 spec-card">
              <div className="card-body text-center">
                <h5 className="card-title">Pending</h5>
                <p className="card-text spec-number text-warning">
                  {stats.pending}
                </p>
                <span className="text-muted">Awaiting approval</span>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0 spec-card">
              <div className="card-body text-center">
                <h5 className="card-title">Approved</h5>
                <p className="card-text spec-number text-success">
                  {stats.approved}
                </p>
                <span className="text-muted">Published remedies</span>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0 spec-card">
              <div className="card-body text-center">
                <h5 className="card-title">Rejected</h5>
                <p className="card-text spec-number text-danger">
                  {stats.rejected}
                </p>
                <span className="text-muted">Needs revision</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SpecialistDashboard;
