

import API from "./api";

export const createOrder = async (orderData: any) => {
  try {
    const res = await API.post("/orders", orderData);
    return res.data;
  } catch (error: any) {
    console.log("SERVICE ERROR:", error.response?.data);

    throw {
      message: error.response?.data?.message || "Order failed",
    };
  }
};

export const getMyOrders = async () => {
  const res = await API.get("/orders/my");
  return res.data;
};

export const getAllOrders = async () => {
  const res = await API.get("/orders");
  return res.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const res = await API.put(`/orders/${orderId}`, { status });
  return res.data;
};