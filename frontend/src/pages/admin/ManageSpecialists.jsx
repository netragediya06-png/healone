import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/admin.css";

export default function ManageSpecialists() {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);

  // NEW STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchSpecialists();
  }, []);

  // IMPORTANT: Fetch ALL specialists (not only pending)
  const fetchSpecialists = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/specialists",
        {
          headers: { userid: userId },
        }
      );
      setSpecialists(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await axios.put(
      `http://localhost:5000/api/admin/specialists/${id}/approve`,
      {},
      { headers: { userid: userId } }
    );
    fetchSpecialists();
  };

  const handleReject = async (id) => {
    await axios.put(
      `http://localhost:5000/api/admin/specialists/${id}/reject`,
      {},
      { headers: { userid: userId } }
    );
    fetchSpecialists();
  };

  // SEARCH + FILTER LOGIC
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
    <div className="admin-dashboard">
      <div className="admin-wrapper">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Specialist Management</h2>
          <span className="badge bg-primary px-3 py-2">
            Total: {specialists.length}
          </span>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search by name, specialization, or city..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FILTER BUTTONS */}
       <div className="filter-tabs">
  {["all","pending","approved","rejected"].map(status => (
    <button
      key={status}
      className={filterStatus === status ? "active" : ""}
      onClick={() => setFilterStatus(status)}
    >
      {status}
    </button>
  ))}
</div>

        {/* CONTENT */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredSpecialists.length === 0 ? (
          <div className="alert alert-warning">
            No specialists found.
          </div>
        ) : (
          <div className="row">
            {filteredSpecialists.map((sp) => (
              <div className="col-md-6 col-lg-4 mb-4" key={sp._id}>
                <div className="card shadow-sm h-100 border-0 specialist-card">
                  <div className="card-body">

                    {/* Profile Section */}
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={
                          sp.profilePhoto ||
                          "https://via.placeholder.com/60"
                        }
                        alt="profile"
                        className="rounded-circle me-3"
                        width="60"
                        height="60"
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <h5 className="mb-0">{sp.fullName}</h5>
                        <small className="text-muted">
                          {sp.professionalDetails?.specialization}
                        </small>
                      </div>
                    </div>

                    <p className="mb-2 text-muted">
                      {sp.location?.city}, {sp.location?.state}
                    </p>

                    {/* STATUS BADGE */}
                    <span
                      className={`badge mb-3 ${
                        sp.verificationStatus === "approved"
                          ? "bg-success"
                          : sp.verificationStatus === "rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {sp.verificationStatus}
                    </span>

                    {/* Action Buttons */}
                   <div className="card-actions">

  <button
    className="view-btn"
    data-bs-toggle="offcanvas"
    data-bs-target="#specialistDetails"
    onClick={() => setSelectedSpecialist(sp)}
  >
    View
  </button>

  <div className="approval-actions">
    <button
      className="approve-btn"
      onClick={() => handleApprove(sp._id)}
    >
      ✓
    </button>

    <button
      className="reject-btn"
      onClick={() => handleReject(sp._id)}
    >
      ✕
    </button>
  </div>

</div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= OFFCANVAS PANEL ================= */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="specialistDetails"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">Specialist Profile</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body">
          {selectedSpecialist && (
            <>
              {/* Profile Header */}
              <div className="text-center mb-4">
                <img
                  src={
                    selectedSpecialist.profilePhoto ||
                    "https://via.placeholder.com/100"
                  }
                  className="rounded-circle mb-2"
                  width="100"
                  height="100"
                  style={{ objectFit: "cover" }}
                  alt="profile"
                />
                <h5>{selectedSpecialist.fullName}</h5>
                <span className="badge bg-secondary">
                  {selectedSpecialist.professionalDetails?.specialization}
                </span>
              </div>

              {/* Tabs */}
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button
                    className="nav-link active"
                    data-bs-toggle="tab"
                    data-bs-target="#infoTab"
                  >
                    Info
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#professionalTab"
                  >
                    Professional
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#documentsTab"
                  >
                    Documents
                  </button>
                </li>
              </ul>

              <div className="tab-content">
                <div className="tab-pane fade show active" id="infoTab">
                  <p><strong>Email:</strong> {selectedSpecialist.email}</p>
                  <p><strong>Phone:</strong> {selectedSpecialist.phone}</p>
                  <p><strong>City:</strong> {selectedSpecialist.location?.city}</p>
                  <p><strong>State:</strong> {selectedSpecialist.location?.state}</p>
                  <p><strong>Full Address:</strong> {selectedSpecialist.location?.address}</p>
                  <p><strong>Pincode:</strong> {selectedSpecialist.location?.pincode}</p>
                  <p><strong>Languages:</strong> {selectedSpecialist.languagesSpoken?.join(", ")}</p>
                  <p><strong>Available Slots:</strong> {selectedSpecialist.availableTimeSlots}</p>
                </div>

                <div className="tab-pane fade" id="professionalTab">
                  <p><strong>Experience:</strong> {selectedSpecialist.professionalDetails?.experience} years</p>
                  <p><strong>Qualification:</strong> {selectedSpecialist.professionalDetails?.qualification}</p>
                  <p><strong>Practice Name:</strong> {selectedSpecialist.professionalDetails?.practiceName}</p>
                  <p><strong>Consultation Mode:</strong> {selectedSpecialist.professionalDetails?.consultationMode}</p>
                  <p><strong>Consultation Fees:</strong> ₹{selectedSpecialist.consultationFees}</p>
                  <hr />
                  <p><strong>Bio:</strong> {selectedSpecialist.bio}</p>
                  <p><strong>Expertise Summary:</strong> {selectedSpecialist.expertiseSummary}</p>
                  <p><strong>Treatment Approach:</strong> {selectedSpecialist.treatmentApproach}</p>
                </div>

                <div className="tab-pane fade" id="documentsTab">
                  {selectedSpecialist.documents?.idProof ? (
                    <a
                      href={selectedSpecialist.documents.idProof}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-secondary btn-sm me-2"
                    >
                      View ID Proof
                    </a>
                  ) : (
                    <p>No ID Proof Uploaded</p>
                  )}

                  {selectedSpecialist.documents?.certificationProof ? (
                    <a
                      href={selectedSpecialist.documents.certificationProof}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-secondary btn-sm"
                    >
                      View Certificate
                    </a>
                  ) : (
                    <p>No Certificate Uploaded</p>
                  )}
                </div>
              </div>

              <hr />

              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-success"
                  data-bs-dismiss="offcanvas"
                  onClick={() => handleApprove(selectedSpecialist._id)}
                >
                  Approve
                </button>

                <button
                  className="btn btn-danger"
                  data-bs-dismiss="offcanvas"
                  onClick={() => handleReject(selectedSpecialist._id)}
                >
                  Reject
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}