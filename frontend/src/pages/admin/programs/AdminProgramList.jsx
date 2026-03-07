import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminProgramList.module.css";
import {
  getAdminPrograms,
  deleteProgram,
  approveProgram,
  rejectProgram
} from "../../../services/programService";

function AdminProgramList() {

  const [programs, setPrograms] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await getAdminPrograms();
      setPrograms(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this program?")) return;

    try {

      await deleteProgram(id);

      setPrograms(programs.filter((p) => p._id !== id));

    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveProgram(id);
      fetchPrograms();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectProgram(id);
      fetchPrograms();
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredPrograms = programs.filter((program) => {

    const matchesSearch =
      program.title.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      activeTab === "all" || program.approvalStatus === activeTab;

    return matchesSearch && matchesTab;
  });

  /* ---------------- COUNTS ---------------- */

  const total = programs.length;
  const pending = programs.filter(p => p.approvalStatus === "pending").length;
  const approved = programs.filter(p => p.approvalStatus === "approved").length;
  const rejected = programs.filter(p => p.approvalStatus === "rejected").length;

  return (

    <div className={styles.container}>

      {/* HEADER */}

      <div className={styles.header}>

        <h2 className={styles.pageTitle}>Wellness Programs</h2>

        <span className={styles.totalBadge}>
          {total} Total Programs
        </span>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search programs..."
        className={styles.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABS */}

      <div className={styles.tabs}>

        <button
          className={activeTab === "all" ? styles.activeTab : ""}
          onClick={() => setActiveTab("all")}
        >
          All ({total})
        </button>

        <button
          className={activeTab === "pending" ? styles.activeTab : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({pending})
        </button>

        <button
          className={activeTab === "approved" ? styles.activeTab : ""}
          onClick={() => setActiveTab("approved")}
        >
          Approved ({approved})
        </button>

        <button
          className={activeTab === "rejected" ? styles.activeTab : ""}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected ({rejected})
        </button>

      </div>

      {/* PROGRAM CARDS */}

      <div className={styles.grid}>

        {filteredPrograms.map((program) => (

          <div
  key={program._id}
  
  className={`${styles.card} ${
    program.approvalStatus === "pending"
      ? styles.cardPending
      : program.approvalStatus === "approved"
      ? styles.cardApproved
      : styles.cardRejected
  }`}
>


            <img
              src={program.image}
              alt={program.title}
              className={styles.image}
            />

            <h3 className={styles.title}>
              {program.title}
            </h3>

            <p className={styles.category}>
              {program.category?.name}
            </p>

            <p className={styles.specialist}>
              Specialist: {program.specialist?.fullName || "N/A"}
            </p>

            <div className={styles.metaRow}>
              <span>Duration: {program.durationDays} Days</span>
              <span className={styles.price}>₹ {program.price}</span>
            </div>

            <span className={`${styles.status} ${styles[program.approvalStatus]}`}>
              {program.approvalStatus}
            </span>

            {/* ACTION BUTTONS */}

            <div className={styles.actions}>

              <Link to={`/admin/programs/${program._id}`}>
                <button className={styles.viewBtn}>View</button>
              </Link>

              <button
                className={styles.approveBtn}
                disabled={program.approvalStatus === "approved"}
                onClick={() => handleApprove(program._id)}
              >
                Approve
              </button>

              <button
                className={styles.rejectBtn}
                disabled={program.approvalStatus === "rejected"}
                onClick={() => handleReject(program._id)}
              >
                Reject
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(program._id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}

export default AdminProgramList;