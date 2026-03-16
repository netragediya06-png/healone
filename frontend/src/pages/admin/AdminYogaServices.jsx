import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminYogaServices = () => {

  const [yogaList, setYogaList] = useState([]);
  const [selectedYoga, setSelectedYoga] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchYoga();
  }, [statusFilter]);

  const fetchYoga = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/yoga",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let data = res.data;

      if (statusFilter !== "All") {
        data = data.filter(y => y.status === statusFilter);
      }

      setYogaList(data || []);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }

  };


  const updateStatus = async (id, status) => {

    await axios.put(
      `http://localhost:5000/api/yoga/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchYoga();

  };


  const deleteYoga = async (id) => {

    await axios.delete(
      `http://localhost:5000/api/yoga/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSelectedYoga(null);
    fetchYoga();

  };


  const filteredYoga = yogaList.filter((y) =>
    y.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const stats = {
    total: yogaList.length,
    pending: yogaList.filter((y) => y.status === "Pending").length,
    approved: yogaList.filter((y) => y.status === "Approved").length,
    rejected: yogaList.filter((y) => y.status === "Rejected").length,
  };


  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div>

        <h2 className="text-2xl font-bold text-gray-800">
          Yoga Management
        </h2>

        <p className="text-sm text-gray-500">
          Review and manage specialist yoga submissions
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
        placeholder="Search yoga..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-green-500"
      />


      {/* CARD GRID */}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {loading ? (

          <div className="col-span-full text-center text-gray-500">
            Loading yoga...
          </div>

        ) : filteredYoga.map((yoga) => (

          <div
            key={yoga._id}
            className="bg-white rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition overflow-hidden cursor-pointer"
            onClick={() => {
              setSelectedYoga(yoga);
              setEditMode(false);
            }}
          >

            {yoga.image && (
              <img
                src={yoga.image}
                alt={yoga.title}
                className="w-full h-28 object-cover"
              />
            )}

            <div className="p-4 space-y-2">

              <div className="flex justify-between">

                <h3 className="font-semibold text-sm">
                  {yoga.title}
                </h3>

                <span
                  className={`text-xs px-2 py-1 rounded-full
                    ${
                      yoga.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : yoga.status === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {yoga.status}
                </span>

              </div>

              <p className="text-sm text-gray-500">
                {yoga.category}
              </p>

              <p className="text-xs text-gray-400">
                {yoga.duration} min • {yoga.difficulty}
              </p>

              <div className="flex justify-between text-xs text-gray-400">
                <span>❤️ {yoga.savedBy?.length || 0}</span>
                <span>👁 {yoga.views || 0}</span>
              </div>


              <div
                className="flex gap-2 pt-2"
                onClick={(e) => e.stopPropagation()}
              >

                {yoga.status === "Pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(yoga._id, "Approved")}
                      className="bg-green-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(yoga._id, "Rejected")}
                      className="bg-yellow-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() => deleteYoga(yoga._id)}
                  className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* DRAWER */}

      {/* DRAWER */}

{selectedYoga && (

  <div
    className="fixed inset-0 bg-black/40 flex justify-end z-50"
    onClick={() => setSelectedYoga(null)}
  >

    <div
      className="bg-white w-full max-w-lg h-full overflow-y-auto p-6 animate-slideIn"
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">

        <h3 className="text-lg font-semibold">
          {selectedYoga.title}
        </h3>

        <button
          onClick={() => setSelectedYoga(null)}
          className="text-gray-500 hover:text-black"
        >
          ✕
        </button>

      </div>


      {/* IMAGE */}

      {selectedYoga.image && (

        <img
          src={selectedYoga.image}
          alt={selectedYoga.title}
          className="w-full h-48 object-contain bg-gray-50 rounded-lg p-3 mb-4"
        />

      )}


      {/* VIDEO */}

      {selectedYoga.videoUrl && (

        <iframe
          className="w-full h-52 rounded mb-4"
          src={selectedYoga.videoUrl.replace("watch?v=", "embed/")}
          title="Yoga Video"
          allowFullScreen
        />

      )}


      {/* BASIC INFO */}

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">

        <div>
          <span className="text-gray-500">Pose Name</span>
          <p className="font-medium">{selectedYoga.subtitle}</p>
        </div>

        <div>
          <span className="text-gray-500">Category</span>
          <p className="font-medium">{selectedYoga.category}</p>
        </div>

        <div>
          <span className="text-gray-500">Difficulty</span>
          <p className="font-medium">{selectedYoga.difficulty}</p>
        </div>

        <div>
          <span className="text-gray-500">Duration</span>
          <p className="font-medium">{selectedYoga.duration} min</p>
        </div>

        <div>
          <span className="text-gray-500">Calories</span>
          <p className="font-medium">{selectedYoga.caloriesBurn}</p>
        </div>

      </div>


      {/* TAGS */}

      {selectedYoga.tags?.length > 0 && (

        <div className="mb-4">

          <h4 className="font-semibold mb-2">Tags</h4>

          <div className="flex flex-wrap gap-2">

            {selectedYoga.tags.map((tag, i) => (

              <span
                key={i}
                className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>

            ))}

          </div>

        </div>

      )}


      {/* DESCRIPTION */}

      <div className="mb-4">

        <h4 className="font-semibold mb-2">Description</h4>

        <p className="text-sm text-gray-700">
          {selectedYoga.description}
        </p>

      </div>


      {/* BENEFITS */}

      {selectedYoga.benefits?.length > 0 && (

        <div className="mb-4">

          <h4 className="font-semibold mb-2">Benefits</h4>

          <ul className="list-disc ml-5 text-sm">

            {selectedYoga.benefits.map((b,i)=>(
              <li key={i}>{b}</li>
            ))}

          </ul>

        </div>

      )}


      {/* STEPS */}

      {selectedYoga.steps?.length > 0 && (

        <div className="mb-4">

          <h4 className="font-semibold mb-2">Steps</h4>

          <ol className="list-decimal ml-5 text-sm">

            {selectedYoga.steps.map((s,i)=>(
              <li key={i}>{s}</li>
            ))}

          </ol>

        </div>

      )}


      {/* CAUTIONS */}

      {selectedYoga.cautions?.length > 0 && (

        <div>

          <h4 className="font-semibold mb-2">Cautions</h4>

          <ul className="list-disc ml-5 text-sm">

            {selectedYoga.cautions.map((c,i)=>(
              <li key={i}>{c}</li>
            ))}

          </ul>

        </div>

      )}

    </div>

  </div>

)}

    </div>

  );

};

export default AdminYogaServices;