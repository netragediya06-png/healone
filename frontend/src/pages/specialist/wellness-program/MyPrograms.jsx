import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyPrograms,
  deleteProgram
} from "../../../services/programService";

function MyPrograms() {

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const res = await getMyPrograms();
      setPrograms(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete this program?")) return;

    try {
      await deleteProgram(id);
      alert("Program deleted");
      loadPrograms();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  const getStatusColor = (status) => {

    if (status === "approved")
      return "bg-green-100 text-green-700";

    if (status === "pending")
      return "bg-yellow-100 text-yellow-700";

    if (status === "rejected")
      return "bg-red-100 text-red-700";

    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Loading programs...</p>
      </div>
    );
  }

  return (

    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-2xl font-bold">
            My Wellness Programs
          </h1>
        </div>

        <Link to="/specialist/create-program">
          <button className="bg-green-600 text-white px-5 py-2 rounded-lg">
            + Create Program
          </button>
        </Link>

      </div>

      {programs.length === 0 ? (

        <div className="bg-white border rounded-xl p-10 text-center">
          <p>No programs yet</p>
        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {programs.map((program) => (

            <div key={program._id}
              className="bg-white border rounded-xl shadow overflow-hidden">

              {program.coverImage ? (
                <img
                  src={program.coverImage}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="h-44 bg-gray-100 flex items-center justify-center">
                  No Image
                </div>
              )}

              <div className="p-5">

                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{program.title}</h3>

                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(program.status)}`}>
                    {program.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {program.category}
                </p>

                <p className="text-sm">
                  Duration: {program.durationDays} days
                </p>

                <div className="flex gap-3 mt-4">

                  <Link to={`/specialist/edit-program/${program._id}`} className="flex-1">
                    <button className="w-full border py-2 rounded">
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(program._id)}
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyPrograms;