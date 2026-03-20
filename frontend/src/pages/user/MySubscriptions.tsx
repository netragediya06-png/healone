import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySubscriptions } from "@/services/subscriptionService";

const MySubscriptions = () => {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await getMySubscriptions();

      // safety check
      setSubs(res.data?.subscriptions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading your programs...</p>
      </div>
    );
  }

  // ================= EMPTY =================
  if (subs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-3">
          No Subscriptions Yet 😢
        </h2>

        <button
          onClick={() => navigate("/programs")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Browse Programs
        </button>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-8">
        My Programs 🎬
      </h1>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {subs.map((sub) => (
          <div
            key={sub._id}
            className="bg-gray-900 rounded-lg overflow-hidden shadow hover:scale-105 transition duration-300"
          >
            {/* IMAGE */}
            <img
              src={
                sub.program?.coverImage ||
                "https://via.placeholder.com/400x250"
              }
              alt={sub.program?.title}
              className="w-full h-40 object-cover"
            />

            {/* CONTENT */}
            <div className="p-4">

              <h2 className="text-lg font-semibold">
                {sub.program?.title}
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Plan: {sub.plan?.name}
              </p>
<p className="text-sm text-gray-400">
  Payment: {sub.paymentMethod || "N/A"}
</p>
              <p className="text-sm text-gray-400">
                Paid: ₹{sub.amountPaid}
              </p>

              <p className="text-sm text-gray-400">
                Valid till:
                {" "}
                {new Date(sub.endDate).toLocaleDateString()}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                  sub.status === "active"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {sub.status}
              </span>

              {/* BUTTON */}
              <button
                onClick={() =>
                  navigate(`/program/${sub.program?._id}`)
                }
                className="mt-4 w-full bg-green-600 hover:bg-green-700 py-2 rounded text-sm"
              >
                Continue
              </button>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
};

export default MySubscriptions;