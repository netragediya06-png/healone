import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminRemedies.module.css";

const AdminRemedies = () => {
  const [remedies, setRemedies] = useState([]);
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRemedies();
  }, [statusFilter]);

  const fetchRemedies = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:5000/api/remedies";
      if (statusFilter !== "All") {
        url += `?status=${statusFilter}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRemedies(res.data.remedies);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:5000/api/remedies/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchRemedies();
  };

  const deleteRemedy = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/remedies/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSelectedRemedy(null);
    fetchRemedies();
  };

  const saveEdit = async () => {
    await axios.put(
      `http://localhost:5000/api/remedies/${selectedRemedy._id}`,
      selectedRemedy,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditMode(false);
    fetchRemedies();
  };

  const filteredRemedies = remedies.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: remedies.length,
    pending: remedies.filter((r) => r.status === "Pending").length,
    approved: remedies.filter((r) => r.status === "Approved").length,
    rejected: remedies.filter((r) => r.status === "Rejected").length,
  };

  return (
    <div className={styles.adminContainer}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h2>Remedy Management</h2>
          <p>Review and manage specialist submissions</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className={styles.statsGrid}>
        <div
          onClick={() => setStatusFilter("All")}
          className={`${styles.statCard} ${
            statusFilter === "All" ? styles.active : ""
          }`}
        >
          <h4>{stats.total}</h4>
          <span>Total</span>
        </div>

        <div
          onClick={() => setStatusFilter("Pending")}
          className={`${styles.statCard} ${styles.pending} ${
            statusFilter === "Pending" ? styles.active : ""
          }`}
        >
          <h4>{stats.pending}</h4>
          <span>Pending</span>
        </div>

        <div
          onClick={() => setStatusFilter("Approved")}
          className={`${styles.statCard} ${styles.approved} ${
            statusFilter === "Approved" ? styles.active : ""
          }`}
        >
          <h4>{stats.approved}</h4>
          <span>Approved</span>
        </div>

        <div
          onClick={() => setStatusFilter("Rejected")}
          className={`${styles.statCard} ${styles.rejected} ${
            statusFilter === "Rejected" ? styles.active : ""
          }`}
        >
          <h4>{stats.rejected}</h4>
          <span>Rejected</span>
        </div>
      </div>

      {/* SEARCH */}
      <div className={styles.controlBar}>
        <input
          type="text"
          placeholder="Search remedy by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loading}>Loading remedies...</div>
        ) : filteredRemedies.length === 0 ? (
          <div className={styles.empty}>
            <h4>No Remedies Found</h4>
            <p>Try adjusting search or filters</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Saved</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRemedies.map((remedy) => (
                <tr key={remedy._id}>
                  <td>{remedy.title}</td>
                  <td>{remedy.healthCategory}</td>
                  <td>{remedy.createdBy?.name}</td>

                  <td>
                    <span
                      className={`${styles.status} ${styles[remedy.status]}`}
                    >
                      {remedy.status}
                    </span>
                  </td>

                  <td>{remedy.savedBy?.length || 0}</td>

                  <td className={styles.actions}>
                    <button
                      onClick={() => {
                        setSelectedRemedy(remedy);
                        setEditMode(false);
                      }}
                      className={styles.view}
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        setSelectedRemedy(remedy);
                        setEditMode(true);
                      }}
                      className={styles.edit}
                    >
                      Edit
                    </button>

                    {remedy.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(remedy._id, "Approved")
                          }
                          className={styles.approve}
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(remedy._id, "Rejected")
                          }
                          className={styles.reject}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => deleteRemedy(remedy._id)}
                      className={styles.delete}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* RIGHT DRAWER */}
      {selectedRemedy && (
        <div className={styles.drawer}>
          <div className={styles.drawerHeader}>
            <h3>{editMode ? "Edit Remedy" : selectedRemedy.title}</h3>
            <button
              onClick={() => setSelectedRemedy(null)}
              className={styles.closeBtn}
            >
              ✕
            </button>
          </div>

          <div className={styles.drawerContent}>
            {editMode ? (
              <>
                <label>Title</label>
                <input
                  value={selectedRemedy.title}
                  onChange={(e) =>
                    setSelectedRemedy({
                      ...selectedRemedy,
                      title: e.target.value,
                    })
                  }
                />

                <label>Symptoms</label>
                <textarea
                  value={selectedRemedy.symptoms?.join(", ") || ""}
                  onChange={(e) =>
                    setSelectedRemedy({
                      ...selectedRemedy,
                      symptoms: e.target.value.split(","),
                    })
                  }
                />

                <label>Ingredients</label>
                <textarea
                  value={selectedRemedy.ingredients.join(", ")}
                  onChange={(e) =>
                    setSelectedRemedy({
                      ...selectedRemedy,
                      ingredients: e.target.value.split(","),
                    })
                  }
                />

                <label>Steps</label>
                <textarea
                  value={selectedRemedy.steps.join(", ")}
                  onChange={(e) =>
                    setSelectedRemedy({
                      ...selectedRemedy,
                      steps: e.target.value.split(","),
                    })
                  }
                />

                <label>Benefits</label>
                <textarea
                  value={selectedRemedy.benefits || ""}
                  onChange={(e) =>
                    setSelectedRemedy({
                      ...selectedRemedy,
                      benefits: e.target.value,
                    })
                  }
                />

                <label>Precautions</label>
                <textarea
                  value={selectedRemedy.precautions || ""}
                  onChange={(e) =>
                    setSelectedRemedy({
                      ...selectedRemedy,
                      precautions: e.target.value,
                    })
                  }
                />

                <button onClick={saveEdit} className={styles.saveBtn}>
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <h4>Symptoms</h4>
                <ul>
                  {selectedRemedy.symptoms?.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>

                <h4>Ingredients</h4>
                <ul>
                  {selectedRemedy.ingredients.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>

                <h4>Steps</h4>
                <ol>
                  {selectedRemedy.steps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>

                <h4>Benefits</h4>
                <p>{selectedRemedy.benefits}</p>

                <h4>Precautions</h4>
                <p>{selectedRemedy.precautions}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRemedies;