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
     FILTER
  ========================= */

  const filteredSpecialists = specialists
    .filter((sp) =>
      sp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.professionalDetails?.specialization
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      sp.location?.city
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((sp) =>
      filterStatus === "all"
        ? true
        : sp.verificationStatus === filterStatus
    );

  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Specialist Management
        </h2>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          Total: {specialists.length}
        </span>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search by name, specialization or city..."
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-green-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* FILTER TABS */}

      <div className="flex gap-2 mb-6">

        {["all", "pending", "approved", "rejected"].map((status) => (

          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium
              ${
                filterStatus === status
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            `}
          >
            {status}
          </button>

        ))}

      </div>

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
              className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
            >

              {/* PROFILE */}

              <div className="flex items-center mb-4">

                <img
                  src={
                    sp.profilePhoto ||
                    "https://via.placeholder.com/60"
                  }
                  alt="profile"
                  className="w-14 h-14 rounded-full object-cover mr-3"
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
                {sp.location?.city}, {sp.location?.state}
              </p>

              {/* STATUS */}

              <span
                className={`px-3 py-1 text-xs rounded-full
                  ${
                    sp.verificationStatus === "approved"
                      ? "bg-green-100 text-green-700"
                      : sp.verificationStatus === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
              >
                {sp.verificationStatus}
              </span>

              {/* ACTIONS */}

              <div className="flex justify-between items-center mt-4">

                <button
                  onClick={() => setSelectedSpecialist(sp)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  View
                </button>

                <div className="flex gap-2">

                  <button
                    onClick={() => handleApprove(sp._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                  >
                    ✓
                  </button>

                  <button
                    onClick={() => handleReject(sp._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                  >
                    ✕
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* SIDE PANEL */}

      {selectedSpecialist && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end">

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

            {/* PROFILE */}

            <div className="text-center mb-6">

              <img
                src={
                  selectedSpecialist.profilePhoto ||
                  "https://via.placeholder.com/100"
                }
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

            {/* INFO */}

            <div className="space-y-2 text-sm">

              <p><strong>Email:</strong> {selectedSpecialist.email}</p>
              <p><strong>Phone:</strong> {selectedSpecialist.phone}</p>
              <p><strong>City:</strong> {selectedSpecialist.location?.city}</p>
              <p><strong>State:</strong> {selectedSpecialist.location?.state}</p>
              <p><strong>Address:</strong> {selectedSpecialist.location?.address}</p>
              <p><strong>Pincode:</strong> {selectedSpecialist.location?.pincode}</p>

              <hr className="my-3" />

              <p><strong>Experience:</strong> {selectedSpecialist.professionalDetails?.experience} years</p>
              <p><strong>Qualification:</strong> {selectedSpecialist.professionalDetails?.qualification}</p>
              <p><strong>Practice:</strong> {selectedSpecialist.professionalDetails?.practiceName}</p>
              <p><strong>Consultation:</strong> {selectedSpecialist.professionalDetails?.consultationMode}</p>
              <p><strong>Fees:</strong> ₹{selectedSpecialist.consultationFees}</p>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}