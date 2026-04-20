import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySubscriptions } from "@/services/subscriptionService";
import { Leaf } from 'lucide-react';
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
        <div className="min-h-screen bg-sucess text-black px-6 py-8">

            {/* TITLE */}
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                My Programs
                <Leaf size={40} className="text-green-500" />
            </h1>

            {/* GRID */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

  {subs.map((sub) => (
    <div
      key={sub._id}
      className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={
            sub.program?.coverImage ||
            "https://via.placeholder.com/400x250"
          }
          alt={sub.program?.title}
          className="w-full h-32 object-cover"
        />

        {/* STATUS BADGE */}
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded-full text-white ${
            sub.status === "active"
              ? "bg-green-600"
              : "bg-red-500"
          }`}
        >
          {sub.status}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-3 space-y-1">

        <h2 className="text-sm font-semibold line-clamp-2">
          {sub.program?.title}
        </h2>

        <p className="text-xs text-gray-600">
          Plan: <span className="font-medium">{sub.plan?.name}</span>
        </p>

        <p className="text-xs text-gray-500">
          Payment: {sub.paymentMethod || "N/A"}
        </p>

        <p className="text-xs text-gray-500">
          Paid: ₹{sub.amountPaid}
        </p>

        <p className="text-xs text-gray-500">
          Valid till:{" "}
          {new Date(sub.endDate).toLocaleDateString()}
        </p>

      </div>
    </div>
  ))}

</div>

        </div>
    );
};

export default MySubscriptions;