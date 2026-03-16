import API from "./api";

// ===============================
// GET PUBLIC PRODUCTS (FOR USERS)
// ===============================
const getProducts = () => {
  return API.get("/products");
};

// ===============================
// GET ADMIN PRODUCTS
// ===============================
const getAdminProducts = (params) => {
  return API.get("/products/admin/all", { params });
};

// ===============================
// GET SINGLE PRODUCT
// ===============================
const getSingleProduct = (id) => {
  return API.get(`/products/${id}`);
};

// ===============================
// CREATE PRODUCT
// ===============================
const createProduct = (data) => {
  return API.post("/products", data);
};

// ===============================
// UPDATE PRODUCT
// ===============================
const updateProduct = (id, data) => {
  return API.put(`/products/${id}`, data);
};

// ===============================
// DELETE PRODUCT
// ===============================
const deleteProduct = (id) => {
  return API.delete(`/products/${id}`);
};

// ===============================
// TOGGLE PRODUCT STATUS
// ===============================
const toggleProductStatus = (id) => {
  return API.put(`/products/toggle/${id}`);
};

export default {
  getProducts,          // ⭐ new
  getAdminProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus
};