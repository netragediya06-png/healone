import { useEffect, useState } from "react";
import axios from "axios";

const SpecialistFeedback = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/feedback",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/feedback/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchFeedback();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Specialist Feedback
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Message</th>
            <th className="p-2 border">Sent To</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              {/* ✅ USER */}
              <td className="p-2 border">
                {item.user?.fullName || "N/A"}
              </td>

              <td className="p-2 border">
                {item.user?.email || "N/A"}
              </td>

              {/* ✅ SUBJECT FIX */}
              <td className="p-2 border">
                {item.subject || "No Subject"}
              </td>

              {/* MESSAGE */}
              <td className="p-2 border">
                {item.message}
              </td>

              {/* TARGET */}
              <td className="p-2 border">
                {item.targetType === "admin"
                  ? "Admin"
                  : "You"}
              </td>

              {/* ACTION */}
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
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
};

export default SpecialistFeedback;