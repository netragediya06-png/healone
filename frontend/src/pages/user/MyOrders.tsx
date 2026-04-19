import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders, cancelOrder } from "../../services/orderService";

/* ================= TYPES ================= */
type Order = {
  _id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

/* ================= COMPONENT ================= */

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelOrder(id);
      fetchOrders(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "confirmed":
        return "text-blue-600";
      case "shipped":
        return "text-purple-600";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  if (loading) return <p className="p-6 text-center">Loading orders...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1">

        <h1 className="text-xl font-semibold mb-4">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          <div className="space-y-4">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
              >

                {/* LEFT */}
                <div>
                  <p className="font-semibold">
                    Order #{order.orderId || order._id.slice(-6)}
                  </p>

                  <p className="text-sm text-gray-500">
                    ₹{order.totalAmount}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right space-y-2">

                  <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>

                  <div className="flex gap-2 justify-end">

                    {/* VIEW */}
                    <button
                      onClick={() => navigate(`/account/order/${order._id}`)}
                      className="text-sm text-blue-600"
                    >
                      View
                    </button>

                    {/* CANCEL */}
                    {!["shipped", "delivered", "cancelled"].includes(order.status) && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="text-sm text-red-600"
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
};

export default MyOrders;