import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../../services/orderService";

/* ================= TYPES ================= */
type Product = {
  name?: string;
  price?: number;
  image?: string;
  quantity: number;
  product?: {
    name: string;
    price: number;
    image: string;
  };
};

type Order = {
  _id: string;
  orderId: string;
  products: Product[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
};

/* ================= COMPONENT ================= */

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await getOrderById(id!);
      setOrder(res.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  return (
  <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

    {/* 🔷 ORDER HEADER */}
    <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
      <div>
        <h2 className="font-semibold text-lg">
          Order #{order.orderId || order._id.slice(-6)}
        </h2>
        <p className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm text-gray-500">Status</p>
        <p className="font-semibold text-green-600 capitalize">
          {order.status}
        </p>
      </div>
    </div>

    {/* 🔷 PRODUCTS */}
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="font-semibold mb-4">Items</h3>

      <div className="divide-y">
        {order.products.map((item, index) => (
          <div key={index} className="flex gap-4 py-4">

            {/* IMAGE */}
            <img
              src={item.image || item.product?.image}
              className="w-20 h-20 object-cover rounded-lg border"
            />

            {/* INFO */}
            <div className="flex-1">
              <p className="font-medium text-gray-800">
                {item.name || item.product?.name}
              </p>

              <p className="text-sm text-gray-500">
                ₹{item.price ?? item.product?.price ?? 0} × {item.quantity}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Quantity: {item.quantity}
              </p>
            </div>

            {/* PRICE */}
            <div className="font-semibold text-gray-800">
              ₹{(item.price ?? item.product?.price ?? 0) * item.quantity}
            </div>

          </div>
        ))}
      </div>
    </div>

    {/* 🔷 BOTTOM SECTION */}
    <div className="grid md:grid-cols-2 gap-6">

      {/* 📍 ADDRESS */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-3">Shipping Address</h3>

        <p className="font-medium">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-gray-500">
          {order.shippingAddress.phone}
        </p>

        <p className="text-sm mt-2 text-gray-700">
          {order.shippingAddress.address},<br />
          {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
          {order.shippingAddress.pincode}
        </p>
      </div>

      {/* 💰 SUMMARY */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-3">Order Summary</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.totalAmount}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery</span>
            <span className="text-green-600">Free</span>
          </div>

          <div className="border-t pt-2 flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Payment: {order.paymentMethod}
        </p>
      </div>

    </div>
  </div>
);
};

export default OrderDetails;
