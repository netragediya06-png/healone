import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyYoga, deleteYoga } from "../../../services/yogaService";

function MyYogaList() {

  const token = localStorage.getItem("token");

  const [yogaList, setYogaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadYoga();
  }, []);

  const loadYoga = async () => {

    try {

      const data = await getMyYoga(token);

      // Ensure we always store an array
      if (Array.isArray(data)) {
        setYogaList(data);
      } else if (Array.isArray(data?.data)) {
        setYogaList(data.data);
      } else {
        setYogaList([]);
      }

    } catch (error) {

      console.error("Error loading yoga:", error);
      setYogaList([]);

    } finally {

      setLoading(false);

    }

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this yoga?")) return;

    try {

      await deleteYoga(id, token);

      setYogaList((prev) => prev.filter((y) => y._id !== id));

    } catch (error) {

      alert("Error deleting yoga");

    }

  };

  const statusColor = (status) => {

    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";

    return "bg-yellow-100 text-yellow-700";

  };

  if (loading) {
    return <div className="p-6">Loading yoga...</div>;
  }

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">My Yoga</h2>

        <Link
          to="/specialist/add-yoga"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Yoga
        </Link>

      </div>


      {yogaList.length === 0 ? (

        <p className="text-gray-500">No yoga added yet.</p>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {yogaList.map((yoga) => (

            <div
              key={yoga._id}
              className="bg-white rounded-lg shadow p-4"
            >

              {/* Image */}
              {yoga.image && (
                <img
                  src={yoga.image}
                  alt={yoga.title}
                  className="w-full h-40 object-cover rounded"
                />
              )}

              {/* Title */}
              <h3 className="text-lg font-semibold mt-3">
                {yoga.title}
              </h3>

              {/* Info */}
              <p className="text-sm text-gray-500">
                Difficulty: {yoga.difficulty}
              </p>

              <p className="text-sm text-gray-500">
                Duration: {yoga.duration} min
              </p>

              {/* Status */}
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded ${statusColor(
                  yoga.status
                )}`}
              >
                {yoga.status}
              </span>

              {/* Buttons */}
              <div className="flex justify-between mt-4">

                <Link
                  to={`/specialist/edit-yoga/${yoga._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(yoga._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default MyYogaList;