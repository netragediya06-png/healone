import React, { useEffect, useState } from "react";
import API from "../../services/api";
import styles from "./AdminOrders.module.css";

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* =========================
     FETCH ORDERS
  ========================= */

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.error("API ERROR:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================
     UPDATE ORDER STATUS
  ========================= */

  const updateStatus = async (id, status) => {

    try {

      await API.put(`/orders/${id}`, { status });

      setOrders(prev =>
        prev.map(o =>
          o._id === id ? { ...o, status } : o
        )
      );

    } catch (error) {

      console.error("Status update error:", error);

    }

  };

  /* =========================
     FILTER + SEARCH
  ========================= */

  const filteredOrders = orders.filter(order => {

    const matchStatus =
      statusFilter === "all" || order.status === statusFilter;

    const customerName =
      order.user?.fullName?.toLowerCase() || "";

    const orderNumber =
      order.orderNumber?.toLowerCase() || "";

    const matchSearch =
      customerName.includes(search.toLowerCase()) ||
      orderNumber.includes(search.toLowerCase());

    return matchStatus && matchSearch;

  });

  /* =========================
     STATS
  ========================= */

  const totalOrders = orders.length;

  const pendingOrders =
    orders.filter(o => o.status === "pending").length;

  const completedOrders =
    orders.filter(o => o.status === "completed").length;

  const cancelledOrders =
    orders.filter(o => o.status === "cancelled").length;

  const totalRevenue =
    orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  if (loading) {
    return <div className={styles.container}>Loading Orders...</div>;
  }

  return (

    <div className={styles.container}>

      <h2 className={styles.title}>Manage Orders</h2>

      {/* =========================
         STATS
      ========================= */}

      <div className={styles.stats}>

        <div className={styles.card}>
          <h3>{totalOrders}</h3>
          <p>Total Orders</p>
        </div>

        <div className={styles.card}>
          <h3>{pendingOrders}</h3>
          <p>Pending</p>
        </div>

        <div className={styles.card}>
          <h3>{completedOrders}</h3>
          <p>Completed</p>
        </div>

        <div className={styles.card}>
          <h3>{cancelledOrders}</h3>
          <p>Cancelled</p>
        </div>

        <div className={styles.card}>
          <h3>₹{totalRevenue}</h3>
          <p>Total Revenue</p>
        </div>

      </div>

      {/* =========================
         FILTERS
      ========================= */}

      <div className={styles.filters}>

        <input
          type="text"
          placeholder="Search order or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.select}
        >

          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>

        </select>

      </div>

      {/* =========================
         ORDERS TABLE
      ========================= */}

      <table className={styles.table}>

        <thead>

          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Products</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
            <th>Update</th>
          </tr>

        </thead>

        <tbody>

          {filteredOrders.map(order => (

            <tr
              key={order._id}
              onClick={() => setSelectedOrder(order)}
            >

              <td className={styles.orderId}>
                {order.orderNumber || `#${order._id.slice(-6)}`}
              </td>

              <td>

                <strong>{order.user?.fullName}</strong>

                <br />

                <span className={styles.email}>
                  {order.user?.email}
                </span>

              </td>

              <td>

                {order.products?.map(p => (

                  <div key={p._id} className={styles.productLine}>
                    {p.product?.name || p.name} × {p.quantity}
                  </div>

                ))}

              </td>

              <td>

                {order.paymentMethod}

                <br />

                <small>
                  {order.paymentStatus || "pending"}
                </small>

              </td>

              <td className={styles.total}>
                ₹{order.totalAmount}
              </td>

              <td>

                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "-"}

              </td>

              <td>

                <span
                  className={`${styles.status} ${styles[order.status]}`}
                >
                  {order.status}
                </span>

              </td>

              <td>

                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                  className={styles.statusSelect}
                >

                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>

                </select>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* =========================
         ORDER DETAILS DRAWER
      ========================= */}

      {selectedOrder && (

        <div className={styles.drawer}>

          <h3>
            Order {selectedOrder.orderNumber || selectedOrder._id.slice(-6)}
          </h3>

          <p><strong>Customer:</strong> {selectedOrder.user?.fullName}</p>

          <p><strong>Email:</strong> {selectedOrder.user?.email}</p>

          <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>

          <p><strong>Total:</strong> ₹{selectedOrder.totalAmount}</p>

          <h4>Products</h4>

          {selectedOrder.products?.map(p => (

            <div key={p._id}>
              {p.product?.name || p.name} × {p.quantity}
            </div>

          ))}

          {selectedOrder.shippingAddress && (

            <>
              <h4>Shipping Address</h4>

              <p>{selectedOrder.shippingAddress.fullName}</p>
              <p>{selectedOrder.shippingAddress.phone}</p>
              <p>{selectedOrder.shippingAddress.address}</p>

              <p>
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state}
              </p>

              <p>{selectedOrder.shippingAddress.pincode}</p>
            </>

          )}

          <button
            className={styles.closeBtn}
            onClick={() => setSelectedOrder(null)}
          >
            Close
          </button>

        </div>

      )}

    </div>
  );
};

export default AdminOrders;