import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import remedyService from "../../../services/remedyService";

function MyRemedies() {
  const [remedies, setRemedies] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchRemedies();
  }, []);

  const fetchRemedies = async () => {
    try {
      const data = await remedyService.getMyRemedies(user._id);
      setRemedies(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await remedyService.deleteRemedy(id, user._id);
      fetchRemedies();
    }
  };

  const getStatusColor = (status) => {
    if (status === "Approved") return "green";
    if (status === "Rejected") return "red";
    return "orange";
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Remedies</h3>
        <button
          className="btn btn-success"
          onClick={() => navigate("/specialist/add-remedy")}
        >
          + Add Remedy
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Health Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {remedies.map((remedy) => (
            <tr key={remedy._id}>
              <td>{remedy.title}</td>
              <td>{remedy.healthCategory}</td>
              <td>
                <span
                  style={{
                    color: "white",
                    backgroundColor: getStatusColor(remedy.status),
                    padding: "5px 10px",
                    borderRadius: "20px",
                  }}
                >
                  {remedy.status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() =>
                    navigate(`/specialist/edit-remedy/${remedy._id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(remedy._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyRemedies;
