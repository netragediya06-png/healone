import API from "./api";

// ===============================
// GET ADMIN PRODUCTS
// ===============================
const getAdminProducts = (params) => {
  return API.get("/products/admin/all", { params });
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
// DELETE PRODUCT (Soft Delete)
// ===============================
const deleteProduct = (id) => {
  return API.delete(`/products/${id}`);
};

export default {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};