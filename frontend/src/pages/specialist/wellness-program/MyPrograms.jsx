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
      setPrograms(res.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };


  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this program?"
    );

    if (!confirmDelete) return;

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


  const getLevelColor = (level) => {

    if (level === "Beginner")
      return "bg-blue-100 text-blue-700";

    if (level === "Intermediate")
      return "bg-purple-100 text-purple-700";

    if (level === "Advanced")
      return "bg-red-100 text-red-700";

    return "bg-gray-100 text-gray-700";

  };


  if (loading) {

    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Loading programs...</p>
      </div>
    );

  }



  return (

    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-2xl font-bold text-gray-800">
            My Wellness Programs
          </h1>

          <p className="text-gray-500 text-sm">
            Manage and monitor your wellness programs
          </p>

        </div>

        <Link to="/specialist/create-program">

          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow">
            + Create Program
          </button>

        </Link>

      </div>



      {programs.length === 0 ? (

        <div className="bg-white border rounded-xl p-10 text-center shadow">

          <p className="text-gray-500 mb-4">
            You haven't created any wellness programs yet
          </p>

          <Link to="/specialist/create-program">

            <button className="bg-green-600 text-white px-5 py-2 rounded-lg">
              Create Your First Program
            </button>

          </Link>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {programs.map((program) => (

            <div
              key={program._id}
              className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >

              {/* IMAGE */}

              {program.coverImage ? (

                <img
                  src={program.coverImage}
                  alt={program.title}
                  className="w-full h-44 object-cover"
                />

              ) : (

                <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>

              )}



              <div className="p-5">

                {/* TITLE + STATUS */}

                <div className="flex justify-between items-start mb-2">

                  <h3 className="font-semibold text-gray-800 text-lg">
                    {program.title}
                  </h3>

                  <span
                    className={`text-xs px-2 py-1 rounded ${getStatusColor(program.status)}`}
                  >
                    {program.status}
                  </span>

                </div>



                {/* LEVEL + CATEGORY */}

                <div className="flex gap-2 mb-3">

                  <span
                    className={`text-xs px-2 py-1 rounded ${getLevelColor(program.programLevel)}`}
                  >
                    {program.programLevel}
                  </span>

                  {program.category && (

                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {program.category}
                    </span>

                  )}

                </div>



                {/* PROGRAM INFO */}

                <div className="text-sm text-gray-500 space-y-1 mb-4">

                  <p>
                    Duration:
                    <span className="ml-1 font-medium">
                      {program.durationDays} days
                    </span>
                  </p>

                  <p>
                    Seats:
                    <span className="ml-1 font-medium">
                      {program.seatsBooked}/{program.seatsLimit}
                    </span>
                  </p>

                  <p>
                    Enrollments:
                    <span className="ml-1 font-medium">
                      {program.totalEnrollments}
                    </span>
                  </p>

                </div>



                {/* RATING */}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">

                  <span>
                    ⭐ {program.rating || 0}
                  </span>

                  <span>
                    {program.reviewCount || 0} reviews
                  </span>

                </div>



                {/* PRICING */}

                {program.plans && program.plans.length > 0 && (

                  <div className="text-sm text-gray-600 mb-4">

                    Price:
                    <span className="font-semibold ml-1 text-gray-800">
                      ₹{program.plans[0].price}
                    </span>

                  </div>

                )}



                {/* DATE */}

                <div className="text-xs text-gray-500 mb-4">

                  Start:
                  {program.startDate
                    ? new Date(program.startDate).toLocaleDateString()
                    : "-"}

                  <span className="mx-2">•</span>

                  End:
                  {program.endDate
                    ? new Date(program.endDate).toLocaleDateString()
                    : "-"}

                </div>



                {/* ACTION BUTTONS */}

                <div className="flex gap-3">

                  <Link
                    to={`/specialist/edit-program/${program._id}`}
                    className="flex-1"
                  >

                    <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50">
                      Edit
                    </button>

                  </Link>

                  <button
                    onClick={() => handleDelete(program._id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100"
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