
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ManageSpecialists() {

  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchSpecialists();
  }, []);

  /* =========================
     FETCH SPECIALISTS
  ========================= */

  const fetchSpecialists = async () => {

    try {

      const res = await API.get("/admin/specialists", {
        headers: { userid: userId },
      });

      setSpecialists(res.data);
      setLoading(false);

    } catch (error) {

      console.log("Fetch specialists error:", error);
      setLoading(false);

    }
  };

  /* =========================
     APPROVE
  ========================= */

  const handleApprove = async (id) => {

    try {

      await API.put(
        `/admin/specialists/${id}/approve`,
        {},
        { headers: { userid: userId } }
      );

      fetchSpecialists();

    } catch (error) {

      console.log("Approve error:", error);

    }
  };

  /* =========================
     REJECT
  ========================= */

  const handleReject = async (id) => {

    try {

      await API.put(
        `/admin/specialists/${id}/reject`,
        {},
        { headers: { userid: userId } }
      );

      fetchSpecialists();

    } catch (error) {

      console.log("Reject error:", error);

    }
  };

  /* =========================
     STATS
  ========================= */

  const total = specialists.length;
  const pending = specialists.filter(s => s.verificationStatus === "pending").length;
  const approved = specialists.filter(s => s.verificationStatus === "approved").length;
  const rejected = specialists.filter(s => s.verificationStatus === "rejected").length;

  /* =========================
     FILTER
  ========================= */

  const filteredSpecialists = specialists
    .filter((sp) =>
      sp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.professionalDetails?.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((sp) =>
      filterStatus === "all"
        ? true
        : sp.verificationStatus === filterStatus
    );

  return (

    <div className="p-6">

      {/* HEADER */}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Specialist Management
      </h2>

      {/* TOP STATS CARDS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <div
          onClick={() => setFilterStatus("all")}
          className={`p-4 rounded-xl cursor-pointer text-center shadow hover:shadow-lg transition
          ${filterStatus === "all" ? "bg-green-600 text-white" : "bg-white"}`}
        >
          <h3 className="text-xl font-bold">{total}</h3>
          <p className="text-sm">Total Specialists</p>
        </div>

        <div
          onClick={() => setFilterStatus("pending")}
          className={`p-4 rounded-xl cursor-pointer text-center shadow hover:shadow-lg transition
          ${filterStatus === "pending" ? "bg-yellow-500 text-white" : "bg-white"}`}
        >
          <h3 className="text-xl font-bold">{pending}</h3>
          <p className="text-sm">Pending</p>
        </div>

        <div
          onClick={() => setFilterStatus("approved")}
          className={`p-4 rounded-xl cursor-pointer text-center shadow hover:shadow-lg transition
          ${filterStatus === "approved" ? "bg-green-500 text-white" : "bg-white"}`}
        >
          <h3 className="text-xl font-bold">{approved}</h3>
          <p className="text-sm">Approved</p>
        </div>

        <div
          onClick={() => setFilterStatus("rejected")}
          className={`p-4 rounded-xl cursor-pointer text-center shadow hover:shadow-lg transition
          ${filterStatus === "rejected" ? "bg-red-500 text-white" : "bg-white"}`}
        >
          <h3 className="text-xl font-bold">{rejected}</h3>
          <p className="text-sm">Rejected</p>
        </div>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search by name, specialization or city..."
        className="w-full md:w-1/2 border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* CONTENT */}

      {loading ? (

        <p>Loading...</p>

      ) : filteredSpecialists.length === 0 ? (

        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
          No specialists found.
        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredSpecialists.map((sp) => (

            <div
              key={sp._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-5 border"
            >

              <div className="flex items-center gap-3 mb-4">

                <img
                  src={sp.profilePhoto || "https://via.placeholder.com/60"}
                  alt="profile"
                  className="w-14 h-14 rounded-full object-cover border"
                />

                <div>

                  <h4 className="font-semibold text-gray-800">
                    {sp.fullName}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {sp.professionalDetails?.specialization}
                  </p>

                </div>

              </div>

              <p className="text-sm text-gray-500 mb-3">
                📍 {sp.location?.city}, {sp.location?.state}
              </p>

              <span
                className={`inline-block px-3 py-1 text-xs rounded-full
                ${
                  sp.verificationStatus === "approved"
                    ? "bg-green-100 text-green-700"
                    : sp.verificationStatus === "rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {sp.verificationStatus}
              </span>

              <div className="flex justify-between items-center mt-5">

                <button
                  onClick={() => setSelectedSpecialist(sp)}
                  className="px-4 py-1.5 text-sm rounded-md
                  border border-blue-500 text-blue-600
                  hover:bg-blue-500 hover:text-white
                  transition"
                >
                  View
                </button>

                <div className="flex gap-2">

                  <button
                    onClick={() => handleApprove(sp._id)}
                    className="px-3 py-1.5 text-sm rounded-md
                    border border-green-500 text-green-600
                    hover:bg-green-500 hover:text-white
                    transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(sp._id)}
                    className="px-3 py-1.5 text-sm rounded-md
                    border border-red-500 text-red-600
                    hover:bg-red-500 hover:text-white
                    transition"
                  >
                    Reject
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* DRAWER */}

      {selectedSpecialist && (

        <div className="fixed inset-0 bg-black/40 flex justify-end">

          <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto">

            <div className="flex justify-between items-center mb-4">

              <h3 className="text-lg font-semibold">
                Specialist Profile
              </h3>

              <button
                onClick={() => setSelectedSpecialist(null)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>

            </div>

            <div className="text-center mb-6">

              <img
                src={selectedSpecialist.profilePhoto || "https://via.placeholder.com/100"}
                className="w-24 h-24 rounded-full mx-auto object-cover mb-3"
                alt="profile"
              />

              <h4 className="font-semibold">
                {selectedSpecialist.fullName}
              </h4>

              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                {selectedSpecialist.professionalDetails?.specialization}
              </span>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

