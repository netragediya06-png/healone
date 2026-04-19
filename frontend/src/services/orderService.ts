import API from "./api";

/* ================= CREATE ORDER ================= */
export const createOrder = async (orderData: any) => {
  try {
    const res = await API.post("/orders", orderData);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Order failed" };
  }
};

/* ================= USER ================= */

// 📦 Get My Orders
export const getMyOrders = async () => {
  try {
    const res = await API.get("/orders/my");
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch orders" };
  }
};

// 📄 Get Single Order
export const getOrderById = async (orderId: string) => {
  try {
    const res = await API.get(`/orders/${orderId}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch order" };
  }
};

// ❌ Cancel Order
export const cancelOrder = async (orderId: string) => {
  try {
    const res = await API.put(`/orders/${orderId}/cancel`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Cancel failed" };
  }
};

/* ================= ADMIN ================= */

// 📊 Get All Orders
export const getAllOrders = async () => {
  try {
    const res = await API.get("/orders");
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch all orders" };
  }
};

// 🔄 Update Order Status
export const updateOrderStatus = async (
  orderId: string,
  status: string
) => {
  try {
    const res = await API.put(`/orders/${orderId}/status`, { status });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Update failed" };
  }
};