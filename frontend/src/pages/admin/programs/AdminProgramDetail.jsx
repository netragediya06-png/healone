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

  if (!program)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading program...
      </div>
    );

  return (

    <div className="p-6 max-w-4xl mx-auto">

      {/* CARD */}

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-bold text-gray-800">
            Program Details
          </h2>

          <span
            className={`px-3 py-1 text-xs rounded-full font-medium
              ${
                program.approvalStatus === "approved"
                  ? "bg-green-100 text-green-700"
                  : program.approvalStatus === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }
            `}
          >
            {program.approvalStatus}
          </span>

        </div>


        {/* IMAGE */}

        {program.image && (

          <img
            src={program.image}
            alt={program.title}
            className="w-full h-60 object-cover rounded-lg"
          />

        )}


        {/* DETAILS GRID */}

        <div className="grid md:grid-cols-2 gap-4 text-sm">

          <p>
            <span className="font-semibold text-gray-700">
              Title:
            </span>{" "}
            {program.title}
          </p>

          <p>
            <span className="font-semibold text-gray-700">
              Category:
            </span>{" "}
            {program.category?.name}
          </p>

          <p>
            <span className="font-semibold text-gray-700">
              Specialist:
            </span>{" "}
            {program.specialist?.fullName}
          </p>

          <p>
            <span className="font-semibold text-gray-700">
              Duration:
            </span>{" "}
            {program.durationDays} Days
          </p>

          <p>
            <span className="font-semibold text-gray-700">
              Price:
            </span>{" "}
            ₹{program.price}
          </p>

        </div>


        {/* DESCRIPTION */}

        <div>

          <h4 className="font-semibold text-gray-800 mb-2">
            Description
          </h4>

          <p className="text-gray-600 text-sm leading-relaxed">
            {program.description}
          </p>

        </div>


        {/* ACTION BUTTONS */}

        <div className="flex gap-3 pt-4 border-t">

          {program.approvalStatus === "pending" && (

            <button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Approve Program
            </button>

          )}

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Delete Program
          </button>

          <button
            onClick={() => navigate("/admin/programs")}
            className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
          >
            Back
          </button>

        </div>

      </div>

    </div>

  );

}

export default AdminProgramDetail;