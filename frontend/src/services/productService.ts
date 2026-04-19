import API from "./api";

// ===============================
// GET PUBLIC PRODUCTS (FOR USERS)
// ===============================
const getProducts = (params = "") => {
  return API.get(`/products${params}`);
};
// ===============================
// GET ADMIN PRODUCTS
// ===============================
const getAdminProducts = (params: any) => {
  return API.get("/products/admin/all", { params });
};

// ===============================
// GET SINGLE PRODUCT
// ===============================
const getSingleProduct = (id: any) => {
  return API.get(`/products/${id}`);
};

// ===============================
// CREATE PRODUCT
// ===============================
const createProduct = (data: any) => {
  return API.post("/products", data);
};

// ===============================
// UPDATE PRODUCT
// ===============================
const updateProduct = (id: any, data: any) => {
  return API.put(`/products/${id}`, data);
};

// ===============================
// DELETE PRODUCT
// ===============================
const deleteProduct = (id: any) => {
  return API.delete(`/products/${id}`);
};

// ===============================
// TOGGLE PRODUCT STATUS
// ===============================
const toggleProductStatus = (id: any) => {
  return API.put(`/products/toggle/${id}`);
};
/* ===============================
   ❤️ PRODUCT WISHLIST
=============================== */

// Toggle wishlist (add/remove)
const toggleWishlistProduct = (productId: string) => {
  return API.post("/users/wishlist/product", { productId });
};

// Get wishlist products
const getWishlistProducts = () => {
  return API.get("/users/wishlist-products");
};
export default {
  getProducts,          // ⭐ new
  getAdminProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  toggleWishlistProduct,
  getWishlistProducts
};