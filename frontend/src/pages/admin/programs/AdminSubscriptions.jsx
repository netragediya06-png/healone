import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import styles from "./AdminSubscriptions.module.css";

const AdminSubscriptions = () => {

  const [subscriptions, setSubscriptions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {

      const res = await API.get("/subscriptions/admin/all", {
        headers: { userid: userId }
      });

      // Safe handling
      const data = res?.data?.subscriptions || [];

      setSubscriptions(data);
      setFiltered(data);

    } catch (error) {
      console.log("Subscription fetch error:", error);
      setSubscriptions([]);
      setFiltered([]);
    }
  };

  /* =============================
      SEARCH + FILTER
  ============================== */

  useEffect(() => {

    let data = [...subscriptions];

    if (search) {
      data = data.filter((sub) =>
        sub.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        sub.program?.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((sub) => sub.status === statusFilter);
    }

    setFiltered(data);

  }, [search, statusFilter, subscriptions]);

  /* =============================
      DASHBOARD STATS
  ============================== */

  const total = subscriptions?.length || 0;

  const active =
    subscriptions?.filter((s) => s.status === "active").length || 0;

  const expired =
    subscriptions?.filter((s) => s.status === "expired").length || 0;

  const revenue =
    subscriptions?.reduce((acc, sub) => {
      return acc + (sub.program?.price || 0);
    }, 0) || 0;

  return (

    <div className={styles.dashboard}>

      <div className={styles.wrapper}>

        <h2 className={styles.title}>Subscription Management</h2>

        {/* ======================
            DASHBOARD STATS
        ======================= */}

        <div className={styles.statGrid}>

          <div className={styles.statCard}>
            <h3 className={styles.statNumber}>{total}</h3>
            <p className={styles.statLabel}>Total Subscriptions</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statNumber}>{active}</h3>
            <p className={styles.statLabel}>Active</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statNumber}>{expired}</h3>
            <p className={styles.statLabel}>Expired</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statNumber}>₹{revenue}</h3>
            <p className={styles.statLabel}>Total Revenue</p>
          </div>

        </div>


        {/* ======================
            SEARCH + FILTER
        ======================= */}

        <div className={styles.filterRow}>

          <input
            type="text"
            placeholder="Search user or program..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className={styles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >

            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>

          </select>

        </div>


        {/* ======================
            SUBSCRIPTION TABLE
        ======================= */}

        <div className={styles.tableWrapper}>

          <table className={styles.table}>

            <thead>

              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Program</th>
                <th>Price</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {filtered?.length === 0 ? (

                <tr>
                  <td colSpan="7" className={styles.empty}>
                    No subscriptions found
                  </td>
                </tr>

              ) : (

                filtered.map((sub) => (

                  <tr key={sub._id}>

                    <td>{sub.user?.fullName || "N/A"}</td>

                    <td>{sub.user?.email || "N/A"}</td>

                    <td>{sub.program?.title || "N/A"}</td>

                    <td>₹{sub.program?.price || 0}</td>

                    <td>
                      {sub.startDate
                        ? new Date(sub.startDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>
                      {sub.endDate
                        ? new Date(sub.endDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>

                      <span
                        className={
                          sub.status === "active"
                            ? styles.badgeActive
                            : styles.badgeExpired
                        }
                      >
                        {sub.status || "N/A"}
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
};

export default AdminSubscriptions;