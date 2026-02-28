import axios from "axios";

const API = "http://localhost:5000/api/products";

// ===============================
// GET ADMIN PRODUCTS
// ===============================
const getAdminProducts = (params) => {
  return axios.get(`${API}/admin/all`, {
    params,
    headers: {
      userid: localStorage.getItem("userId"),
    },
  });
};

// ===============================
// CREATE PRODUCT
// ===============================
const createProduct = (data) => {
  return axios.post(API, data, {
    headers: {
      userid: localStorage.getItem("userId"),
    },
  });
};

// ===============================
// UPDATE PRODUCT
// ===============================
const updateProduct = (id, data) => {
  return axios.put(`${API}/${id}`, data, {
    headers: {
      userid: localStorage.getItem("userId"),
    },
  });
};

// ===============================
// DELETE PRODUCT (Soft Delete)
// ===============================
const deleteProduct = (id) => {
  return axios.delete(`${API}/${id}`, {
    headers: {
      userid: localStorage.getItem("userId"),
    },
  });
};

export default {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
