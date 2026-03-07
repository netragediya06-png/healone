import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";

function AdminProgramDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);

  useEffect(() => {
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    try {

      const res = await API.get(`/programs/${id}`);

      setProgram(res.data);

    } catch (error) {
      console.log("Error fetching program", error);
    }
  };

  const handleApprove = async () => {
    try {

      await API.put(`/programs/approve/${id}`);

      alert("Program approved");

      fetchProgram();

    } catch (error) {
      console.log("Approve error", error);
    }
  };

  const handleDelete = async () => {

    if (!window.confirm("Delete this program?")) return;

    try {

      await API.delete(`/programs/${id}`);

      alert("Program deleted");

      navigate("/admin/programs");

    } catch (error) {
      console.log("Delete error", error);
    }
  };

  if (!program) return <p>Loading...</p>;

  return (

    <div className="admin-program-detail">

      <h2>Program Details</h2>

      <p><strong>Title:</strong> {program.title}</p>

      <p><strong>Description:</strong> {program.description}</p>

      <p><strong>Category:</strong> {program.category?.name}</p>

      <p><strong>Specialist:</strong> {program.specialist?.fullName}</p>

      <p><strong>Duration:</strong> {program.durationDays} Days</p>

      <p><strong>Price:</strong> ₹{program.price}</p>

      <p><strong>Status:</strong> {program.approvalStatus}</p>

      {program.image && (
        <img
          src={program.image}
          alt={program.title}
          width="200"
        />
      )}

      <br /><br />

      {program.approvalStatus === "pending" && (
        <button onClick={handleApprove}>
          Approve Program
        </button>
      )}

      <button
        onClick={handleDelete}
        style={{ marginLeft: "10px" }}
      >
        Delete Program
      </button>

    </div>

  );
}

export default AdminProgramDetail;