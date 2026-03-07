import API from "./api";


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

  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  return API.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};


// ===============================
// UPDATE PRODUCT
// ===============================
const updateProduct = (id, data) => {

  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  return API.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

};


// ===============================
// DELETE PRODUCT
// ===============================
const deleteProduct = (id) => {
  return API.delete(`/products/${id}`);
};

const toggleProductStatus = (id) => {
  return API.put(`/products/toggle/${id}`);
};
export default {
  getAdminProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
   toggleProductStatus
};