import React, { useEffect, useState } from "react";
import axios from "axios";

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

      const res = await axios.get(
        "http://localhost:5000/api/remedies",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let data = res.data;

      if (statusFilter !== "All") {
        data = data.filter(r => r.status === statusFilter);
      }

      setRemedies(data || []);
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
    r.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const stats = {
    total: remedies.length,
    pending: remedies.filter((r) => r.status === "Pending").length,
    approved: remedies.filter((r) => r.status === "Approved").length,
    rejected: remedies.filter((r) => r.status === "Rejected").length,
  };


  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div>

        <h2 className="text-2xl font-bold text-gray-800">
          Remedy Management
        </h2>

        <p className="text-sm text-gray-500">
          Review and manage specialist submissions
        </p>

      </div>


      {/* STATS */}

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
              ${card.color}
              ${statusFilter === card.key ? "ring-2 ring-green-500" : ""}
            `}
          >

            <h4 className="text-xl font-bold">{card.value}</h4>
            <span className="text-sm text-gray-600">{card.label}</span>

          </div>

        ))}

      </div>


      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search remedy..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-green-500"
      />


      {/* CARD GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading ? (

          <div className="col-span-full text-center text-gray-500">
            Loading remedies...
          </div>

        ) : filteredRemedies.length === 0 ? (

          <div className="col-span-full text-center">
            <h4 className="font-semibold">No Remedies Found</h4>
            <p className="text-sm text-gray-500">Try adjusting search or filters</p>
          </div>

        ) : (

          filteredRemedies.map((remedy) => (

            <div
              key={remedy._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl
              hover:-translate-y-2 hover:scale-[1.02]
              transition-all duration-300 ease-in-out
              overflow-hidden flex flex-col cursor-pointer"
            >

              {/* IMAGE */}

              {remedy.image && (

                <div className="bg-gray-50 flex items-center justify-center h-40 overflow-hidden">

                  <img
                    src={remedy.image}
                    alt={remedy.title}
                    className="h-32 object-contain transition-transform duration-300 hover:scale-110"
                  />

                </div>

              )}


              {/* CONTENT */}

              <div className="p-4 flex flex-col justify-between flex-grow">

                <div>

                  <div className="flex justify-between items-start mb-2">

                    <h3 className="font-semibold text-sm text-gray-800">
                      {remedy.title}
                    </h3>

                    <span
                      className={`text-xs px-2 py-1 rounded-full
                      ${remedy.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : remedy.status === "Rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {remedy.status}
                    </span>

                  </div>

                  <p className="text-xs text-gray-500 mb-3">
                    {remedy.healthCategory}
                  </p>

                  <div className="flex justify-between text-xs text-gray-400 mb-3">
                    <span>❤️ {remedy.savedBy?.length || 0}</span>
                    <span>👁 {remedy.views || 0}</span>
                  </div>

                </div>


                {/* BUTTONS */}

                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={() => {
                      setSelectedRemedy(remedy);
                      setEditMode(false);
                    }}
                    className="px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      setSelectedRemedy(remedy);
                      setEditMode(true);
                    }}
                    className="px-3 py-1 text-xs rounded-md bg-slate-600 text-white hover:bg-slate-700 transition"
                  >
                    Edit
                  </button>

                  {remedy.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(remedy._id, "Approved")}
                        className="px-3 py-1 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(remedy._id, "Rejected")}
                        className="px-3 py-1 text-xs rounded-md bg-amber-500 text-white hover:bg-amber-600 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteRemedy(remedy._id)}
                    className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>


      {/* DRAWER */}

      {selectedRemedy && (

        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">

          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-6">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-4">

              <h3 className="text-lg font-semibold">
                {editMode ? "Edit Remedy" : selectedRemedy.title}
              </h3>

              <button
                onClick={() => setSelectedRemedy(null)}
                className="text-gray-500 text-lg"
              >
                ✕
              </button>

            </div>


            {/* IMAGE */}

            {selectedRemedy.image && (

              <img
                src={selectedRemedy.image}
                alt={selectedRemedy.title}
                className="w-full h-48 object-contain bg-gray-50 rounded-lg p-3 mb-4"
              />

            )}


            {/* EDIT MODE */}

            {editMode ? (

              <div className="space-y-3">

                <label className="font-medium">Title</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={selectedRemedy.title}
                  onChange={(e) =>
                    setSelectedRemedy({
                      ...selectedRemedy,
                      title: e.target.value
                    })
                  }
                />

                <label className="font-medium">Symptoms</label>
                <textarea
                  className="border rounded px-3 py-2 w-full"
                  value={selectedRemedy.symptoms?.join(", ") || ""}
                  onChange={(e) =>
                    setSelectedRemedy({
                      ...selectedRemedy,
                      symptoms: e.target.value.split(",")
                    })
                  }
                />

                <button
                  onClick={saveEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition"
                >
                  Save Changes
                </button>

              </div>

            ) : (

              <div className="space-y-4">

                <div>
                  <h4 className="font-semibold">Usage</h4>
                  <p>{selectedRemedy.usage}</p>
                </div>

                <div>
                  <h4 className="font-semibold">Symptoms</h4>
                  <ul className="list-disc ml-5">
                    {selectedRemedy.symptoms?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Ingredients</h4>
                  <ul className="list-disc ml-5">
                    {selectedRemedy.ingredients?.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Steps</h4>
                  <ol className="list-decimal ml-5">
                    {selectedRemedy.steps?.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold">Benefits</h4>
                  <p>{selectedRemedy.benefits}</p>
                </div>

                <div>
                  <h4 className="font-semibold">Precautions</h4>
                  <p>{selectedRemedy.precautions}</p>
                </div>

              </div>

            )}

          </div>

        </div>

      )}
    </div>

  );

};

export default AdminRemedies;