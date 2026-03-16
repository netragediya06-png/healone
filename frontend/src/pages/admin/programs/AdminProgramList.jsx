import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      setPrograms(res.data || []);
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

  /* FILTER */

  const filteredPrograms = programs.filter((program) => {

    const title = program?.title?.toLowerCase() || "";

    const matchesSearch = title.includes(search.toLowerCase());

    const matchesTab =
      activeTab === "all" || program?.approvalStatus === activeTab;

    return matchesSearch && matchesTab;

  });

  /* COUNTS */

  const total = programs.length;
  const pending = programs.filter(p => p.approvalStatus === "pending").length;
  const approved = programs.filter(p => p.approvalStatus === "approved").length;
  const rejected = programs.filter(p => p.approvalStatus === "rejected").length;

  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-semibold text-gray-800">
          Wellness Programs
        </h2>

        <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
          {total} Total Programs
        </span>

      </div>


      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search programs..."
        className="w-full border rounded-lg px-4 py-2 mb-5 focus:ring-2 focus:ring-green-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      {/* TABS */}

      <div className="flex gap-2 mb-6">

        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-sm
            ${activeTab === "all"
              ? "bg-green-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          All ({total})
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-lg text-sm
            ${activeTab === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          Pending ({pending})
        </button>

        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 rounded-lg text-sm
            ${activeTab === "approved"
              ? "bg-green-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          Approved ({approved})
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-4 py-2 rounded-lg text-sm
            ${activeTab === "rejected"
              ? "bg-red-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          Rejected ({rejected})
        </button>

      </div>


      {/* PROGRAM GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {filteredPrograms.map((program) => (

          <div
            key={program._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
          >

            {/* IMAGE */}

            <img
              src={program.image || "https://via.placeholder.com/300x200"}
              alt={program.title}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />

            {/* TITLE */}

            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {program.title || "Untitled Program"}
            </h3>

            {/* CATEGORY */}

            <p className="text-sm text-gray-500">
              {program.category?.name || "No Category"}
            </p>

            {/* SPECIALIST */}

            <p className="text-xs text-gray-500 mb-2">
              Specialist: {program.specialist?.fullName || "N/A"}
            </p>

            {/* META */}

            <div className="flex justify-between text-sm mb-2">

              <span>
                Duration: {program.durationDays || 0} Days
              </span>

              <span className="font-semibold text-green-600">
                ₹ {program.price || 0}
              </span>

            </div>

            {/* STATUS */}

            <span
              className={`inline-block text-xs px-2 py-1 rounded-full mb-3
                ${
                  program.approvalStatus === "approved"
                    ? "bg-green-100 text-green-700"
                    : program.approvalStatus === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }
              `}
            >
              {program.approvalStatus}
            </span>


            {/* ACTION BUTTONS */}

            <div className="flex flex-wrap gap-2">

              <Link to={`/admin/programs/${program._id}`}>
                <button className="bg-green-700 text-white px-3 py-1 rounded text-xs">
                  View
                </button>
              </Link>

              <button
                className="bg-green-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                disabled={program.approvalStatus === "approved"}
                onClick={() => handleApprove(program._id)}
              >
                Approve
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                disabled={program.approvalStatus === "rejected"}
                onClick={() => handleReject(program._id)}
              >
                Reject
              </button>

              <button
                className="border border-red-500 text-red-500 px-3 py-1 rounded text-xs"
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