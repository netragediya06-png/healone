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

      const res = await axios.get("http://localhost:5000/api/remedies", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = res.data;

      if (statusFilter !== "All") {
        data = data.filter((r) => r.status === statusFilter);
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
      { headers: { Authorization: `Bearer ${token}` } },
    );

    fetchRemedies();
  };

  const deleteRemedy = async (id) => {
    await axios.delete(`http://localhost:5000/api/remedies/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSelectedRemedy(null);
    fetchRemedies();
  };

  const saveEdit = async () => {
    await axios.put(
      `http://localhost:5000/api/remedies/${selectedRemedy._id}`,
      selectedRemedy,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    setEditMode(false);
    fetchRemedies();
  };

  const filteredRemedies = remedies.filter((r) =>
    r.title?.toLowerCase().includes(searchTerm.toLowerCase()),
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
        <h2 className="text-2xl font-bold text-gray-800">Remedy Management</h2>

        <p className="text-sm text-gray-500">
          Review and manage specialist submissions
        </p>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: stats.total,
            key: "All",
            color: "bg-gray-100",
          },
          {
            label: "Pending",
            value: stats.pending,
            key: "Pending",
            color: "bg-yellow-100",
          },
          {
            label: "Approved",
            value: stats.approved,
            key: "Approved",
            color: "bg-green-100",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            key: "Rejected",
            color: "bg-red-100",
          },
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
            <p className="text-sm text-gray-500">
              Try adjusting search or filters
            </p>
          </div>
        ) : (
          filteredRemedies.map((remedy) => (
            <div
              key={remedy._id}
              className="bg-card rounded-2xl shadow-card hover:shadow-elevated
  transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* IMAGE */}
              {remedy.image && (
                <div className="h-40 overflow-hidden bg-muted flex items-center justify-center">
                  <img
                    src={remedy.image}
                    alt={remedy.title}
                    className="h-full object-cover"
                  />
                </div>
              )}

              {/* CONTENT */}
              <div className="p-4 space-y-3 flex-grow">
                {/* TITLE */}
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm">{remedy.title}</h3>

                  <span
                    className={`text-xs px-2 py-1 rounded-full
        ${
          remedy.status === "Approved"
            ? "bg-green-100 text-green-700"
            : remedy.status === "Rejected"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-700"
        }`}
                  >
                    {remedy.status}
                  </span>
                </div>

                {/* SUBTITLE */}
                <p className="text-xs text-muted-foreground">
                  {remedy.subtitle}
                </p>

                {/* CATEGORY + DIFFICULTY */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{remedy.category}</span>
                  <span>{remedy.difficulty}</span>
                </div>

                {/* DOSHA */}
                <div className="flex gap-1 flex-wrap">
                  {remedy.doshaAffinity?.map((d, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 bg-accent rounded-full"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                {/* STATS */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>👁 {remedy.views || 0}</span>
                  <span>❤️ {remedy.savedBy?.length || 0}</span>
                  <span>⬇ {remedy.downloads || 0}</span>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedRemedy(remedy);
                      setEditMode(false);
                    }}
                    className="px-3 py-1 text-xs rounded bg-primary text-white"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      setSelectedRemedy(remedy);
                      setEditMode(true);
                    }}
                    className="px-3 py-1 text-xs rounded bg-gray-600 text-white"
                  >
                    Edit
                  </button>

                  {remedy.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(remedy._id, "Approved")}
                        className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(remedy._id, "Rejected")}
                        className="px-3 py-1 text-xs rounded bg-yellow-500 text-white"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteRemedy(remedy._id)}
                    className="px-3 py-1 text-xs rounded bg-red-600 text-white"
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

    <div className="bg-card w-full max-w-lg h-full overflow-y-auto p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          {editMode ? "Edit Remedy" : selectedRemedy.title}
        </h3>

        <button
          onClick={() => setSelectedRemedy(null)}
          className="text-muted-foreground text-lg"
        >
          ✕
        </button>
      </div>

      {/* IMAGE */}
      {selectedRemedy.image && (
        <img
          src={selectedRemedy.image}
          alt={selectedRemedy.title}
          className="w-full h-48 object-contain bg-muted rounded-xl p-3"
        />
      )}

      {/* ================= EDIT MODE ================= */}
      {editMode ? (

        <div className="space-y-4">

          <input
            className="input-premium"
            value={selectedRemedy.title}
            onChange={(e) =>
              setSelectedRemedy({
                ...selectedRemedy,
                title: e.target.value
              })
            }
            placeholder="Title"
          />

          <textarea
            className="input-premium"
            value={selectedRemedy.description || ""}
            onChange={(e) =>
              setSelectedRemedy({
                ...selectedRemedy,
                description: e.target.value
              })
            }
            placeholder="Description"
          />

          <input
            className="input-premium"
            value={selectedRemedy.category || ""}
            onChange={(e) =>
              setSelectedRemedy({
                ...selectedRemedy,
                category: e.target.value
              })
            }
            placeholder="Category"
          />

          <textarea
            className="input-premium"
            value={selectedRemedy.symptoms?.join(", ") || ""}
            onChange={(e) =>
              setSelectedRemedy({
                ...selectedRemedy,
                symptoms: e.target.value.split(",")
              })
            }
            placeholder="Symptoms (comma separated)"
          />

          <textarea
            className="input-premium"
            value={selectedRemedy.steps?.join(", ") || ""}
            onChange={(e) =>
              setSelectedRemedy({
                ...selectedRemedy,
                steps: e.target.value.split(",")
              })
            }
            placeholder="Steps (comma separated)"
          />

          <button
            onClick={saveEdit}
            className="btn-premium w-full"
          >
            Save Changes
          </button>

        </div>

      ) : (

        /* ================= VIEW MODE ================= */

        <div className="space-y-5">

          {/* DESCRIPTION */}
          <div>
            <h4 className="font-semibold">Description</h4>
            <p className="text-sm text-muted-foreground">
              {selectedRemedy.description}
            </p>
          </div>

          {/* CATEGORY + DIFFICULTY */}
          <div className="flex justify-between text-sm">
            <span><b>Category:</b> {selectedRemedy.category}</span>
            <span><b>Difficulty:</b> {selectedRemedy.difficulty}</span>
          </div>

          {/* DOSHA */}
          <div>
            <h4 className="font-semibold">Dosha</h4>
            <div className="flex gap-2 flex-wrap mt-1">
              {selectedRemedy.doshaAffinity?.map((d, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-accent rounded-full"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* SYMPTOMS */}
          <div>
            <h4 className="font-semibold">Symptoms</h4>
            <ul className="list-disc ml-5 text-sm">
              {selectedRemedy.symptoms?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* INGREDIENTS (FIXED STRUCTURE) */}
          <div>
            <h4 className="font-semibold">Ingredients</h4>
            <ul className="list-disc ml-5 text-sm">
              {selectedRemedy.ingredients?.map((ing, i) => (
                <li key={i}>
                  <b>{ing.name}</b> ({ing.quantity}) – {ing.purpose}
                </li>
              ))}
            </ul>
          </div>

          {/* STEPS */}
          <div>
            <h4 className="font-semibold">Steps</h4>
            <ol className="list-decimal ml-5 text-sm">
              {selectedRemedy.steps?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>

          {/* BENEFITS */}
          <div>
            <h4 className="font-semibold">Benefits</h4>
            <ul className="list-disc ml-5 text-sm">
              {selectedRemedy.benefits?.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          {/* PRECAUTIONS */}
          <div>
            <h4 className="font-semibold">Precautions</h4>
            <ul className="list-disc ml-5 text-sm">
              {selectedRemedy.precautions?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          {/* ANALYTICS */}
          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            <span>👁 {selectedRemedy.views || 0}</span>
            <span>❤️ {selectedRemedy.savedBy?.length || 0}</span>
            <span>⬇ {selectedRemedy.downloads || 0}</span>
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
