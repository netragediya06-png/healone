import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import SpecialistDrawer from "./SpecialistDrawer";

export default function ManageSpecialists() {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  /* =========================
     FETCH SPECIALISTS
  ========================= */
  const fetchSpecialists = async () => {
    try {
      const res = await adminService.getSpecialists(filterStatus);
      setSpecialists(res);
      setLoading(false);
    } catch (error) {
      console.log("Fetch specialists error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialists();
  }, [filterStatus]);

  /* =========================
     APPROVE / REJECT
  ========================= */
  const handleApprove = async (id) => {
    await adminService.approveSpecialist(id);
    fetchSpecialists();
  };

  const handleReject = async (id) => {
    await adminService.rejectSpecialist(id, "");
    fetchSpecialists();
  };

  /* =========================
     STATS
  ========================= */
  const total = specialists.length;
  const pending = specialists.filter(
    (s) => s.verification?.status === "pending",
  ).length;
  const approved = specialists.filter(
    (s) => s.verification?.status === "approved",
  ).length;
  const rejected = specialists.filter(
    (s) => s.verification?.status === "rejected",
  ).length;

  /* =========================
     FILTER
  ========================= */
  const filteredSpecialists = specialists
    .filter(
      (sp) =>
        sp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sp.organizationDetails?.specialization
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        sp.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((sp) =>
      filterStatus === "all" ? true : sp.verification?.status === filterStatus,
    );

  return (
    <div className="p-6">
      {/* HEADER */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Specialist Management
      </h2>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: total, color: "green", key: "all" },
          { label: "Pending", value: pending, color: "yellow", key: "pending" },
          {
            label: "Approved",
            value: approved,
            color: "green",
            key: "approved",
          },
          { label: "Rejected", value: rejected, color: "red", key: "rejected" },
        ].map((item) => (
          <div
            key={item.key}
            onClick={() => setFilterStatus(item.key)}
            className={`p-4 rounded-xl cursor-pointer text-center shadow transition
            ${
              filterStatus === item.key
                ? `bg-${item.color}-500 text-white`
                : "bg-white"
            }`}
          >
            <h3 className="text-xl font-bold">{item.value}</h3>
            <p className="text-sm">{item.label}</p>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search specialists..."
        className="w-full md:w-1/2 border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-green-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* LIST */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading specialists...
        </div>
      ) : filteredSpecialists.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
          No specialists found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecialists.map((sp) => (
            <div
              key={sp._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 border"
            >
              {/* PROFILE */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    sp.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${sp.fullName}`
                  }
                  className="w-14 h-14 rounded-full object-cover border-2 border-green-400"
                />

                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {sp.fullName}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {sp.organizationDetails?.specialization?.join(", ")}
                  </p>
                </div>
              </div>

              {/* LOCATION */}
              <p className="text-sm text-gray-500 mb-3">
                📍 {sp.location?.city}, {sp.location?.state}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block px-3 py-1 text-xs rounded-full font-medium
                ${
                  sp.verification?.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : sp.verification?.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {sp.verification?.status}
              </span>

              {/* ACTIONS */}
              <div className="flex justify-between mt-5">
                <button
                  onClick={() => setSelectedSpecialist(sp)}
                  className="px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-500 hover:text-white transition"
                >
                  View
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(sp._id)}
                    className="px-3 py-1 border border-green-500 text-green-600 rounded hover:bg-green-500 hover:text-white transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(sp._id)}
                    className="px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-500 hover:text-white transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedSpecialist && (
        <SpecialistDrawer
          data={selectedSpecialist}
          onClose={() => setSelectedSpecialist(null)}
        />
      )}
    </div>
  );
}
