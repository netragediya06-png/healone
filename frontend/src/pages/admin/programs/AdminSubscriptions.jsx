import { useEffect, useState } from "react";
import API from "../../../services/api";
import styles from "./AdminSubscriptions.module.css";

function AdminSubscriptions() {

  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {

    try {

      const res = await API.get("/subscriptions/admin/all");

      setSubscriptions(res.data);

    } catch (error) {

      console.log("Error fetching subscriptions", error);

    }

  };

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredSubscriptions = subscriptions.filter((sub) => {

    const matchesSearch =
      sub.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      sub.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      sub.program?.title?.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      activeTab === "all" || sub.status === activeTab;

    return matchesSearch && matchesTab;

  });

  /* ---------------- COUNTS ---------------- */

  const total = subscriptions.length;
  const active = subscriptions.filter(s => s.status === "active").length;
  const expired = subscriptions.filter(s => s.status === "expired").length;

  return (

    <div className={styles.container}>

      {/* HEADER */}

      <div className={styles.header}>

        <h2 className={styles.pageTitle}>
          Program Subscriptions
        </h2>

        <span className={styles.totalBadge}>
          {total} Total Subscriptions
        </span>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search subscriptions..."
        className={styles.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER TABS */}

      <div className={styles.tabs}>

        <button
          className={activeTab === "all" ? styles.activeTab : ""}
          onClick={() => setActiveTab("all")}
        >
          All ({total})
        </button>

        <button
          className={activeTab === "active" ? styles.activeTab : ""}
          onClick={() => setActiveTab("active")}
        >
          Active ({active})
        </button>

        <button
          className={activeTab === "expired" ? styles.activeTab : ""}
          onClick={() => setActiveTab("expired")}
        >
          Expired ({expired})
        </button>

      </div>

      {/* TABLE */}

      <table className={styles.table}>

        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Program</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {filteredSubscriptions.map((sub) => (

            <tr key={sub._id}>

              <td>{sub.user?.fullName}</td>

              <td>{sub.user?.email}</td>

              <td>{sub.program?.title}</td>

              <td>
                {new Date(sub.startDate).toLocaleDateString()}
              </td>

              <td>
                {new Date(sub.endDate).toLocaleDateString()}
              </td>

              <td>

                <span
                  className={
                    sub.status === "active"
                      ? styles.statusActive
                      : styles.statusExpired
                  }
                >
                  {sub.status}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default AdminSubscriptions;