import API from "./api";

// ==============================
// GET CART
// ==============================
export const getCart = () => {
  return API.get("/cart");
};

// ==============================
// ADD TO CART
// ==============================
export const addToCart = (productId: any) => {
  return API.post("/cart/add", { productId });
};

// ==============================
// UPDATE QUANTITY
// ==============================
export const updateQuantity = (productId: any, quantity: any) => {
  return API.put("/cart/update", { productId, quantity });
};

// ==============================
// REMOVE ITEM (🔥 FIXED)
// ==============================
export const removeItem = (productId: any) => {
  return API.post("/cart/remove", { productId }); // ✅ FIX: use POST
};

// ==============================
// CLEAR CART (🔥 ADD THIS)
// ==============================
export const clearCart = () => {
  return API.post("/cart/clear"); // make sure backend route exists
};