import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageSpecialists() {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/specialists/pending"
      );
      setSpecialists(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/specialists/${id}/approve`
      );
      fetchSpecialists();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/specialists/${id}/reject`
      );
      fetchSpecialists();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-wrapper">
        <h2 className="mb-4">Manage Specialists</h2>

        {loading ? (
          <p>Loading...</p>
        ) : specialists.length === 0 ? (
          <p>No pending specialist requests.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Profession</th>
                  <th>Experience</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {specialists.map((sp) => (
                  <tr key={sp._id}>
                    <td>{sp.name}</td>
                    <td>{sp.email}</td>
                    <td>{sp.profession}</td>
                    <td>{sp.experience} yrs</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleApprove(sp._id)}
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReject(sp._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}
