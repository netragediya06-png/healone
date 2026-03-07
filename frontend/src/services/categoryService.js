import API from "./api";


// ===============================
// GET ALL CATEGORIES
// ===============================
const getAllCategories = () => {
  return API.get("/categories");
};


// ===============================
// GET CATEGORIES WITH SUBCOUNT (ADMIN)
// ===============================
const getCategoriesWithSubCount = () => {
  return API.get("/categories/with-subcount");
};


// ===============================
// CREATE CATEGORY
// ===============================
const createCategory = (formData) => {
  return API.post("/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// ===============================
// UPDATE CATEGORY
// ===============================
const updateCategory = (id, formData) => {
  return API.put(`/categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// ===============================
// DELETE CATEGORY
// ===============================
const deleteCategory = (id) => {
  return API.delete(`/categories/${id}`);
};


const categoryService = {
  getAllCategories,
  getCategoriesWithSubCount,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;